import { browser, logging } from 'protractor';
import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should have login', async () => {
    await page.navigateTo();
    try {
      const loginInput = await page.getLoginName();
      console.log(loginInput.getText());
      expect(loginInput.getText()).toEqual(jasmine.anything());
    } catch (error) {
      fail("Login element does not exist");
    }
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
