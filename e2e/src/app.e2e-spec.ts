'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of Reservations';
const expectedTitle = `${expectedH1}`;
const targetReservation = { id: 15, name: 'Magneta' };
const targetReservationDashboardIndex = 3;
const nameSuffix = 'X';
const newReservationName = targetReservation.name + nameSuffix;

class Reservation {
  id: number;
  name: string;

  // Factory methods

  // Reservations from string formatted as '<id> <name>'.
  static fromString(s: string): Reservation {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Reservations from Reservations list <li> element.
  static async fromLi(li: ElementFinder): Promise<Reservation> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Reservations id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Reservation> {
    // Get Reservations id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topReservations: element.all(by.css('app-root app-dashboard > div h4')),

      appReservationsHref: navElts.get(1),
      appReservations: element(by.css('app-root app-reservations')),
      allReservations: element.all(by.css('app-root app-reservationes li')),
      selectedReservationSubview: element(by.css('app-root app-reservations > div:last-child')),

      ReservationDetail: element(by.css('app-root app-reservation-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Reservations'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top reservations', () => {
      let page = getPageElts();
      expect(page.topReservations.count()).toEqual(4);
    });

    it(`selects and routes to ${targetReservation.name} details`, dashboardSelectTargetReservations);

    it(`updates reservation name (${newReservationName}) in details view`, updateReservationsNameInDetailView);

    it(`cancels and shows ${targetReservation.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetReservationElt = getPageElts().topReservations.get(targetReservationDashboardIndex);
      expect(targetReservationElt.getText()).toEqual(targetReservation.name);
    });

    it(`selects and routes to ${targetReservation.name} details`, dashboardSelectTargetReservations);

    it(`updates reservation name (${newReservationName}) in details view`, updateReservationNameInDetailView);

    it(`saves and shows ${newReservationName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetReservationElt = getPageElts().topReservations.get(targetReservationDashboardIndex);
      expect(targetReservationElt.getText()).toEqual(newReservationName);
    });

  });

  describe('Reservations tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Reservations view', () => {
      getPageElts().appReservationsHref.click();
      let page = getPageElts();
      expect(page.appReservations.isPresent()).toBeTruthy();
      expect(page.allReservations.count()).toEqual(10, 'number of reservations');
    });

    it('can route to reservation details', async () => {
      getReservationLiEltById(targetReservation.id).click();

      let page = getPageElts();
      expect(page.ReservationDetail.isPresent()).toBeTruthy('shows reservation detail');
      let reservation = await Reservation.fromDetail(page.ReservationDetail);
      expect(reservation.id).toEqual(targetReservation.id);
      expect(reservation.name).toEqual(targetReservation.name.toUpperCase());
    });

    it(`updates reservation name (${newReservationName}) in details view`, updateReservationNameInDetailView);

    it(`shows ${newReservationName} in Reservations list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      let expectedText = `${targetReservation.id} ${newReservationName}`;
      expect(getReservationAEltById(targetReservation.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newReservationName} from Reservations list`, async () => {
      const reservationsBefore = await tReservationArray(getPageElts().allReservations);
      const li = getReservationLiEltById(targetReservation.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appReservations.isPresent()).toBeTruthy();
      expect(page.allReservations.count()).toEqual(9, 'number of reservations');
      const ReservationsAfter = await toReservationArray(page.allReservations);
      // console.log(await Reservation.fromLi(page.allReservations[0]));
      const expectedReservations =  reservationsBefore.filter(h => h.name !== newReservationName);
      expect(reservationsAfter).toEqual(expectedReservations);
      // expect(page.selectedReservationSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetReservation.name}`, async () => {
      const newReservationName = 'Alice';
      const reservationsBefore = await toReservationArray(getPageElts().allReservations);
      const numReservations = reservationsBefore.length;

      element(by.css('input')).sendKeys(newReservationName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let reservationsAfter = await toReservationArray(page.allReservations);
      expect(reservationsAfter.length).toEqual(numReservations + 1, 'number of reservations');

      expect(reservationsAfter.slice(0, numReservations)).toEqual(reservationsBefore, 'Old reservations are still there');

      const maxId = reservationsBefore[reservationsBefore.length - 1].id;
      expect(reservationsAfter[numReservations]).toEqual({id: maxId + 1, name: newReservationName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in reservations.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive reservation search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetReservation.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let reservation = page.searchResults.get(0);
      expect(reservation.getText()).toEqual(targetReservation.name);
    });

    it(`navigates to ${targetReservation.name} details view`, async () => {
      let reservation = getPageElts().searchResults.get(0);
      expect(reservation.getText()).toEqual(targetReservation.name);
      reservation.click();

      let page = getPageElts();
      expect(page.ReservationDetail.isPresent()).toBeTruthy('shows reservation detail');
      let reservation2 = await Reservation.fromDetail(page.ReservationDetail);
      expect(reservation2.id).toEqual(targetReservation.id);
      expect(reservation2.name).toEqual(targetReservation.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetReservations() {
    let targetReservationElt = getPageElts().topReservations.get(targetReservationDashboardIndex);
    expect(targetReservationElt.getText()).toEqual(targetReservation.name);
    targetReservationElt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    let page = getPageElts();
    expect(page.ReservationDetail.isPresent()).toBeTruthy('shows reservation detail');
    let reservation = await Reservation.fromDetail(page.ReservationDetail);
    expect(reservation.id).toEqual(targetReservation.id);
    expect(reservation.name).toEqual(targetReservation.name.toUpperCase());
  }

  async function updateReservationNameInDetailView() {
    // Assumes that the current view is the Reservation details view.
    addToReservationName(nameSuffix);

    let page = getPageElts();
    let reservation = await Reservation.fromDetail(page.ReservationDetail);
    expect(reservation.id).toEqual(targetReservation.id);
    expect(reservation.name).toEqual(newReservationName.toUpperCase());
  }

});

function addToReservationName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getReservationAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getReservationLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toReservationArray(allReservations: ElementArrayFinder): Promise<Reservation[]> {
  let promisedReservations = await allReservations.map(Reservation.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedReservations);
}
