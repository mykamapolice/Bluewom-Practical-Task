import sprites from '../helpers/sprites';

const MESSAGES = {
  ADDED: 'Dodano',
  ERROR: 'Pozycja już istnieje',
};

export default class AllCurrencies {
  constructor(rootElement, index, data) {
    this.rootElement = rootElement;
    this.curentTableIndex = index;
    this.table = null;
    this.message = MESSAGES.ADDED;
    this.data = data;
    this.addCurrencyToFavoriteList = this.addCurrencyToFavoriteList.bind(this);
    this.render = this.render.bind(this);
  }

  async render() {
    await this.createTable();
    if (this.rootElement.firstChild) this.rootElement.firstChild.remove();
    this.rootElement.appendChild(this.table);
  }

  async createTable() {
    const table = document.createElement('table');
    const trHeader = document.createElement('tr');
    const thCurrency = document.createElement('th');
    const thCode = document.createElement('th');
    const thFollow = document.createElement('th');

    thCode.innerText = 'Kod';
    thCurrency.innerText = 'Waluta';
    thFollow.innerText = 'Subskrybuj';

    table.classList.add('pageBody__currency-table');

    if (this.curentTableIndex === 'c') {
      const bid = document.createElement('th');
      const ask = document.createElement('th');

      bid.innerText = 'Kupno';
      ask.innerText = 'Sprzedaż';

      trHeader.append(thCurrency, thCode, bid, ask, thFollow);
    } else {
      const thRate = document.createElement('th');
      thRate.innerText = 'Średni kurs';
      trHeader.append(thCurrency, thCode, thRate, thFollow);
    }
    table.appendChild(trHeader);

    this.createTooltip();
    table.appendChild(this.tooltip);

    const currencies = await this.data;

    currencies.forEach((item) => {
      const trCell = document.createElement('tr');
      const tdCurrency = document.createElement('td');
      const tdCode = document.createElement('td');
      const tdFollow = document.createElement('td');
      const followBtn = document.createElement('button');

      followBtn.addEventListener('click', this.addCurrencyToFavoriteList);
      followBtn.classList.add('tooltip');

      tdCurrency.innerText = item.currency;
      tdCode.innerText = item.code;
      followBtn.innerHTML = sprites.add;
      tdFollow.appendChild(followBtn);
      trCell.dataset.code = item.code;

      if (this.curentTableIndex === 'c') {
        const trBid = document.createElement('td');
        const trAsk = document.createElement('td');

        trBid.innerText = item.bid;
        trAsk.innerText = item.ask;

        trCell.append(tdCurrency, tdCode, trBid, trAsk, tdFollow);
      } else {
        const trRate = document.createElement('td');
        trRate.innerText = item.mid;
        trCell.append(tdCurrency, tdCode, trRate, tdFollow);
      }

      table.appendChild(trCell);
    });

    this.table = table;
  }

  addCurrencyToFavoriteList(e) {
    const { code } = e.target.closest('tr').dataset;
    let oldTable = JSON.parse(localStorage.getItem(`Table-${this.curentTableIndex}`));
    if (oldTable === null) oldTable = [];

    if (oldTable.indexOf(code) === -1) {
      oldTable.push(code);
      this.tooltip.firstChild.innerText = MESSAGES.ADDED;
      this.showTooltip();
      setTimeout(this.hideTooltip, 3000);
    } else {
      this.tooltip.firstChild.innerText = MESSAGES.ERROR;
      this.showTooltip();
      setTimeout(this.hideTooltip, 3000);
    }

    localStorage.setItem(`Table-${this.curentTableIndex}`, JSON.stringify(oldTable));
  }

  createTooltip() {
    const tooltip = document.createElement('div');
    const tooltipText = document.createElement('span');
    tooltipText.innerText = this.message;

    tooltip.classList.add('tooltiptext');
    tooltip.appendChild(tooltipText);
    this.tooltip = tooltip;
  }

  showTooltip() {
    if (this.tooltip === null) return;
    this.tooltip.style.width = '22rem';
  }

  // eslint-disable-next-line class-methods-use-this
  hideTooltip() {
    const tooltip = document.querySelector('.tooltiptext');
    if (tooltip === null) return;
    tooltip.style.width = '0rem';
  }
}
