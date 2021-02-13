import sprites from '../helpers/sprites';

const messages = {
  added: 'added to favorites',
  error: 'item allready exist',
};

export default class AllCurrencies {
  constructor(rootElement, index) {
    this.rootElement = rootElement;
    this.curentTableIndex = index;
    this.tableWrapper = null;
    this.table = null;
    this.message = messages.added;
    this.addCurrencyToFavoriteList = this.addCurrencyToFavoriteList.bind(this);
    this.render = this.render.bind(this);
  }

  async render() {
    await this.createTable();
    if (this.rootElement.firstChild) {
      this.rootElement.firstChild.remove();
    }
    this.rootElement.appendChild(this.table);
  }

  async createTable() {
    const table = document.createElement('table');
    const trHeader = document.createElement('tr');
    const thCurrency = document.createElement('th');
    const thCode = document.createElement('th');
    const thFollow = document.createElement('th');

    thCode.innerText = 'Code';
    thCurrency.innerText = 'Currency';
    thFollow.innerText = 'Follow';

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

    this.createTooltip();
    table.appendChild(this.tooltip);

    const currencies = await this.getCurrency();

    const { rates } = currencies[0];

    rates.forEach((item) => {
      const trCell = document.createElement('tr');
      const trCurrency = document.createElement('td');
      const trCode = document.createElement('td');
      const trFollow = document.createElement('td');
      const followBtn = document.createElement('button');
      // const img = document.createElement('img');

      followBtn.addEventListener('click', this.addCurrencyToFavoriteList);
      followBtn.classList.add('tooltip');

      // img.src = '../images/add.svg';
      trCurrency.innerText = item.currency;
      trCode.innerText = item.code;
      followBtn.innerHTML = sprites.add;
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

  addCurrencyToFavoriteList(e) {
    const { code } = e.target.closest('tr').dataset;
    let oldTable = JSON.parse(localStorage.getItem(`Table-${this.curentTableIndex}`));
    if (oldTable === null) {
      oldTable = [];
    }

    if (oldTable.indexOf(code) === -1) {
      oldTable.push(code);
      this.tooltip.firstChild.innerText = messages.added;
      this.showTooltip();
      setTimeout(this.hideTooltip, 3000);
    } else {
      this.tooltip.firstChild.innerText = messages.error;
      this.showTooltip();
      setTimeout(this.hideTooltip, 3000);
    }

    // oldTable.indexOf(code) === -1 ? oldTable.push(code) : alert('This item already exists');
    localStorage.setItem(`Table-${this.curentTableIndex}`, JSON.stringify(oldTable));
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

  createTooltip() {
    const tooltip = document.createElement('div');
    const tooltipText = document.createElement('span');
    tooltipText.innerText = this.message;

    tooltip.classList.add('tooltiptext');
    tooltip.appendChild(tooltipText);
    this.tooltip = tooltip;
  }

  // eslint-disable-next-line class-methods-use-this
  showTooltip() {
    const a = document.querySelector('.tooltiptext');
    if (a === null) return;
    a.style.width = '22rem';
  }

  // eslint-disable-next-line class-methods-use-this
  hideTooltip() {
    const a = document.querySelector('.tooltiptext');
    if (a === null) return;
    a.style.width = '0rem';
  }
}
