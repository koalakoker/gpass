import { Component, OnInit } from '@angular/core';
import  * as CryptoJS from '../../../node_modules/crypto-js'

@Component({
  selector: 'app-pass-generator',
  templateUrl: './pass-generator.component.html',
  styleUrls: ['./pass-generator.component.css']
})
export class PassGeneratorComponent implements OnInit {

  newPass = "";
  entropy_pool: string = '';
  entropy_bits: number = 0;
  progress = 0;
  bitToTriggerNewPass: number = 115;
  newPassAvailable: boolean = false;
    
  // This constant is kind of arbitrary.
  // How many fractional bits of entropy do I think one mouse position and millisecond sample has added to the pool?
  BITS_PER_SAMPLE = 0.2;

  // 2^48 = 0x1000000000000 = (dec)281474976710656, max must be less than this.
  MAXMAX = 0x1000000000000;

  constructor() { }

  ngOnInit() {
  }

  copyToClipboard() {
  
  }

  // Add entropy to the pool with every mouse movement
  onMouseMove(event: MouseEvent)
  {  
    // IE-centric hack.. if "e" is undefined, fudge in "event" object properties. I don't have to align them
    // with the corner of the screen, because abs values don't matter just how different they are from the last
    // values. Their "unpredictability".
    var e = {"pageX": event.clientX, "pageY": event.clientY};

    this.entropy_pool = CryptoJS.SHA256(this.entropy_pool + (new Date).getMilliseconds() +':'+ e.pageX +':'+ e.pageY).toString(CryptoJS.enc.Hex);
    this.entropy_bits += this.BITS_PER_SAMPLE;
    if(this.entropy_bits > 256) { this.entropy_bits = 256; } // Can't have more entropy than the pool will hold
    
    this.progress = (this.entropy_bits/this.bitToTriggerNewPass)*100;
    if (this.entropy_bits > this.bitToTriggerNewPass)
    {
      this.newPass = this.createNewPass();
      this.newPassAvailable = true;
    }

  }

  // Determines how many bits the integer "max" represents, fractional.
  // Feed into Math.ceil() if you need to round this up to a whole number of bits.
  // or Math.floor() to round down. Most of my calculations are perfectly
  // happy with fractional measurements of abstract bit measurements. :J
  BitsPerMax(max) { return Math.log(max)/Math.log(2); }

  // Attempt to withdraw entropy from the pool by requesting a random integer 0 <= result < max.
  // max must be less than or equal to 2^48 (MAXMAX) to help keep JS integer oprations clean.
  // make multiple withdrawals if you require more entropy than that.
  // NOTE: this code is not re-entrant safe. Do not call from multiple threads simultaneously.
  ERandom(max)
  {
    // cleanse max, rounding it if it's fractional and zeroing or NaNing it if it's non-integer.
    max = Math.floor(parseInt(max));

    var withdraw_bits = this.BitsPerMax(max);

    if(max<2 || isNaN(max)) { console.log("'max' must be an integer > 1"); }
    if(withdraw_bits > 48) { console.log("Cannot withdraw more than 48 bits of entropy per transaction; make max < "+ this.MAXMAX); }
    if(withdraw_bits > this.entropy_bits) { console.log("Not enough entropy in the pool"); }
    
    // record loss of e//ntropy
    this.entropy_bits -= withdraw_bits;

    //if(window.UpdateEntropy) { UpdateEntropy(); }

    // calculate the result we'll return; then use it to help stir the pool.
    // To be clear, we are converting the first 12 nibbles of the pool into an integer, and moduloing that into max.
    //
    // Also, throw the result back and stir again in the edge case
    // where the remainder lies within an incomplete divisor. Taking that precaution
    // nullifies any bias in modulo base conversion statistics.
    //
    // For example, boiling a random number 0 <= x < 10 down to 0 <= y < 4 using y = x % 4
    // gives a 33% bonus to the results "0" and "1", because out of the moduli starting at
    // 4*2, only the first two are represented before you hit the limit of ten.
    // By throwing back any result where floor(x/4) >= floor(10/4), that bias
    // is concisely eliminated.

    do {
      var result = parseInt("0x"+ this.entropy_pool.substr(0,12)) % max;
      this.entropy_pool = CryptoJS.SHA256(this.entropy_pool + result).toString(CryptoJS.enc.Hex);
    } while(Math.floor(parseInt("0x"+ this.entropy_pool.substr(0,12)) / max) >= Math.floor(this.MAXMAX / max));

    return(result);
  }

  createNewPass(): string
  {
    const specialChar = [
      " ",     "!",     "\"",    "#",    
      "$",     "%",     "&",     "'",     "(",    
      ")",     "*",     "+",     ",",     "-",    
      ".",     "/",     ":",     ";",     "<",    
      "=",     ">",     "?",     "@",     
      "[",     "\\",    "]",     "^",     "_",    
      "`",     "{",     "|",     "}",    
      "~"
    ];

    var newPass: string = "";
    for (let index = 0; index < 16; index++) {

      const group = this.ERandom(4);
      var sch, ch;

      switch (group) {
        case 0:
        default:
          {
            ch = this.ERandom(26) + 97;
          }
          break;
      
        case 1:
          {
            ch = this.ERandom(26) + 65;
          }
          break;
        
        case 2:
          {
            ch = this.ERandom(10) + 48;
          }
          break;
        
        case 3:
          {
            ch = specialChar[this.ERandom(specialChar.length)].charCodeAt(0);
          }
          break;
      }

      sch = String.fromCharCode(ch);
      newPass += sch;
    }
    return newPass;
  }

}
