export default class FavoreCurrencies {
  constructor(rootElement, index) {
    this.rootElement = rootElement;
    this.curentTableIndex = index;
    this.tableWrapper = null;
    this.favCur = [];
    this.table = null;
    this.removeCurrencyFromFavoriteList = this.removeCurrencyFromFavoriteList.bind(this);
    this.unfollowAllCurrencies = this.unfollowAllCurrencies.bind(this);
  }

  async render() {
    this.getFavoriteurencies();
    await this.createTable();
    if (this.favCur.length < 1) {
      this.rootElement.firstChild.remove();
      const message = document.createElement('h1');
      message.innerText = 'nie obserwujesz jeszcze zadnej waluty!';
      this.rootElement.appendChild(message);
    } else {
      this.rootElement.firstChild.remove();
      this.rootElement.appendChild(this.table);
    }
  }

  getFavoriteurencies() {
    const currencies = JSON.parse(localStorage.getItem(`Table-${this.curentTableIndex}`));
    if (!currencies) {
      return;
    }
    currencies.forEach((item) => {
      this.favCur.push(item);
    });
  }

  async createTable() {
    const table = document.createElement('table');
    const trHeader = document.createElement('tr');
    const thCurrency = document.createElement('th');
    const thCode = document.createElement('th');
    const thFollow = document.createElement('th');
    const unfollowAllBtn = document.createElement('button');

    thCode.innerText = 'Code';
    thCurrency.innerText = 'Currency';
    thFollow.innerText = 'Unfollow';
    unfollowAllBtn.innerText = 'clear';
    thFollow.appendChild(unfollowAllBtn);

    unfollowAllBtn.addEventListener('click', this.unfollowAllCurrencies);

    table.classList.add('pageBody__currency-table');

    if (this.curentTableIndex === 'c') {
      const bid = document.createElement('th');
      const ask = document.createElement('th');

      bid.innerText = 'bid';
      ask.innerText = 'ask';

      trHeader.append(thCurrency, thCode, bid, ask, thFollow);
    } else {
      const thRate = document.createElement('th');
      thRate.innerText = 'Middle currency rate';
      trHeader.append(thCurrency, thCode, thRate, thFollow);
    }

    table.appendChild(trHeader);

    const currencies = await this.getCurrency();

    const { rates } = currencies[0];

    rates.forEach((item) => {
      const trCell = document.createElement('tr');
      const trCurrency = document.createElement('td');
      const trCode = document.createElement('td');
      const trFollow = document.createElement('td');
      const followBtn = document.createElement('button');

      if (this.favCur.indexOf(item.code) === -1) {
        return;
      }

      followBtn.addEventListener('click', this.removeCurrencyFromFavoriteList);

      trCurrency.innerText = item.currency;
      trCode.innerText = item.code;
      followBtn.innerText = 'Unfollow';
      trFollow.appendChild(followBtn);
      trCell.dataset.code = item.code;

      if (this.curentTableIndex === 'c') {
        const trBid = document.createElement('td');
        const trAsk = document.createElement('td');

        trBid.innerText = item.bid;
        trAsk.innerText = item.ask;

        trCell.append(trCurrency, trCode, trBid, trAsk, trFollow);
      } else {
        const trRate = document.createElement('td');
        trRate.innerText = item.mid;
        trCell.append(trCurrency, trCode, trRate, trFollow);
      }

      table.appendChild(trCell);
    });

    this.table = table;
  }

  unfollowAllCurrencies() {
    localStorage.removeItem(`Table-${this.curentTableIndex}`);
    this.rootElement.remove();
  }

  removeCurrencyFromFavoriteList(e) {
    const { code } = e.target.closest('tr').dataset;
    const oldTable = JSON.parse(localStorage.getItem(`Table-${this.curentTableIndex}`));
    const index = oldTable.indexOf(code);
    oldTable.splice(index, 1);
    localStorage.setItem(`Table-${this.curentTableIndex}`, JSON.stringify(oldTable));
    e.target.closest('tr').remove();
  }

  async getCurrency() {
    const url = `http://api.nbp.pl/api/exchangerates/tables/${this.curentTableIndex}`;
    try {
      const response = await fetch(url);
      const currencies = await response.json();
      this.currenies = currencies[0].rates;
      return currencies;
    } catch (e) {
      throw new Error(e);
    }
  }
}
