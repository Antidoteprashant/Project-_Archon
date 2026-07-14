document.addEventListener('DOMContentLoaded', () => {
  const tradeButtons = document.querySelectorAll('.market-card__actions .btn, .market-table td .btn');
  const tradeDialog = document.getElementById('tradeDialog');
  const tradeCloseBtn = document.getElementById('tradeCloseBtn');
  const tradeForm = document.getElementById('tradeForm');
  
  const tradeAssetIcon = document.getElementById('tradeAssetIcon');
  const tradeAssetTitle = document.getElementById('tradeAssetTitle');
  const tradeAssetTicker = document.getElementById('tradeAssetTicker');
  const tradeWalletBalance = document.getElementById('tradeWalletBalance');
  const tradeAssetReserves = document.getElementById('tradeAssetReserves');
  const tradeCurrentPrice = document.getElementById('tradeCurrentPrice');
  
  const tradeOrderType = document.getElementById('tradeOrderType');
  const limitPriceGroup = document.getElementById('limitPriceGroup');
  const tradeLimitPrice = document.getElementById('tradeLimitPrice');
  
  const tradeAmount = document.getElementById('tradeAmount');
  const tradeAmountLabel = document.getElementById('tradeAmountLabel');
  const tradeAssetSuffix = document.getElementById('tradeAssetSuffix');
  const tradeNotional = document.getElementById('tradeNotional');
  const tradeLeverage = document.getElementById('tradeLeverage');
  
  const tradeStopLoss = document.getElementById('tradeStopLoss');
  const tradeTakeProfit = document.getElementById('tradeTakeProfit');
  
  const tradeMarginRequired = document.getElementById('tradeMarginRequired');
  const tradeFee = document.getElementById('tradeFee');
  const tradeRisk = document.getElementById('tradeRisk');
  const tradeReward = document.getElementById('tradeReward');
  const tradeRRRatio = document.getElementById('tradeRRRatio');
  const tradeBalAfter = document.getElementById('tradeBalAfter');
  
  const tradeSubmitBtn = document.getElementById('tradeSubmitBtn');
  const tradeErrorMsg = document.getElementById('tradeErrorMsg');
  
  const tradeTabs = document.querySelectorAll('.trade-tab');
  const tradeSuccessToast = document.getElementById('tradeSuccessToast');
  const toastMessage = document.getElementById('toastMessage');

  let currentAssetPrice = 0;
  let currentAssetTicker = '';
  let currentAssetName = '';
  let isBuyMode = true; // true = Long, false = Short

  // Authentication check
  function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  function getUserData() {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    let usersData = JSON.parse(localStorage.getItem('usersData') || '{}');
    return { currentUserEmail, usersData, userData: usersData[currentUserEmail] };
  }

  function formatCurrency(num) {
    return '$' + num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  function parseCurrency(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/[^0-9.-]+/g, ""));
  }

  function showError(msg) {
    if (msg) {
      tradeErrorMsg.textContent = msg;
      tradeErrorMsg.hidden = false;
    } else {
      tradeErrorMsg.hidden = true;
    }
  }

  // Display asset reserves
  function updateReservesDisplay(userData) {
    if (!userData) return;
    if (!userData.reserves) {
      userData.reserves = {
        'BTC': 0.5,
        'ETH': 10.0,
        'SOL': 150.0
      };
    }
    const currentQty = userData.reserves[currentAssetTicker] || 0;
    tradeAssetReserves.textContent = `${currentQty.toFixed(4)} ${currentAssetTicker}`;
  }

  // Sync Amount and Notional
  function syncInputs(source) {
    const price = getExecutionPrice();
    if (price <= 0) return;

    if (source === 'amount') {
      const amount = parseFloat(tradeAmount.value);
      if (!isNaN(amount)) {
        tradeNotional.value = (amount * price).toFixed(2);
      } else {
        tradeNotional.value = '';
      }
    } else if (source === 'notional') {
      const notional = parseFloat(tradeNotional.value);
      if (!isNaN(notional)) {
        tradeAmount.value = (notional / price).toFixed(6);
      } else {
        tradeAmount.value = '';
      }
    }
    updateCalculations();
  }

  function getExecutionPrice() {
    if (tradeOrderType.value === 'limit') {
      return parseFloat(tradeLimitPrice.value) || 0;
    }
    return currentAssetPrice;
  }

  // Update Live Risk Summary calculations
  function updateCalculations() {
    showError(''); // clear errors during typing
    const amount = parseFloat(tradeAmount.value) || 0;
    const notional = parseFloat(tradeNotional.value) || 0;
    const leverage = parseFloat(tradeLeverage.value) || 1;
    const price = getExecutionPrice();
    const sl = parseFloat(tradeStopLoss.value);
    const tp = parseFloat(tradeTakeProfit.value);

    // 1. Margin and Fees
    const margin = notional / leverage;
    const fee = notional * 0.001; // 0.1% fee on notional
    
    tradeFee.textContent = formatCurrency(fee);
    
    if (!isBuyMode && leverage === 1) {
      tradeMarginRequired.textContent = '-'; // Spot sell doesn't require USD margin
    } else {
      tradeMarginRequired.textContent = formatCurrency(margin);
    }

    // 2. Stop Loss Risk
    let risk = 0;
    if (!isNaN(sl) && sl > 0) {
      const diff = isBuyMode ? (price - sl) : (sl - price);
      risk = diff * amount;
      tradeRisk.textContent = formatCurrency(risk > 0 ? risk : 0);
    } else {
      tradeRisk.textContent = '-';
    }

    // 3. Take Profit Reward
    let reward = 0;
    if (!isNaN(tp) && tp > 0) {
      const diff = isBuyMode ? (tp - price) : (price - tp);
      reward = diff * amount;
      tradeReward.textContent = formatCurrency(reward > 0 ? reward : 0);
    } else {
      tradeReward.textContent = '-';
    }

    // 4. R:R Ratio
    if (risk > 0 && reward > 0) {
      const rr = reward / risk;
      tradeRRRatio.textContent = `1 : ${rr.toFixed(2)}`;
    } else {
      tradeRRRatio.textContent = '-';
    }

    // 5. Balance After Trade
    const { userData } = getUserData();
    if (userData && userData.dashboard) {
      const currentBal = parseCurrency(userData.dashboard.balance);
      let balAfter = 0;
      
      if (!isBuyMode && leverage === 1) {
        // Spot Sell: You get USD back minus fee
        balAfter = currentBal + notional - fee;
      } else {
        // Long or Margin Short: You pay margin + fee
        const totalCost = margin + fee;
        balAfter = currentBal - totalCost;
      }
      
      tradeBalAfter.textContent = formatCurrency(balAfter);
      if (balAfter < 0) {
        tradeBalAfter.style.color = 'var(--danger)';
      } else {
        tradeBalAfter.style.color = 'var(--text-primary)';
      }
    }
  }

  // Validation Engine
  function validateOrder() {
    const amount = parseFloat(tradeAmount.value);
    const notional = parseFloat(tradeNotional.value);
    const leverage = parseFloat(tradeLeverage.value) || 1;
    const price = getExecutionPrice();
    const sl = parseFloat(tradeStopLoss.value);
    const tp = parseFloat(tradeTakeProfit.value);

    if (isNaN(amount) || amount <= 0 || isNaN(notional) || notional <= 0) {
      return 'Quantity and USD amount must be greater than zero.';
    }
    
    if (price <= 0) {
      return 'Invalid execution price.';
    }

    if (!isNaN(sl)) {
      if (isBuyMode && sl >= price) return 'Long: Stop-loss must be below entry price.';
      if (!isBuyMode && sl <= price) return 'Short: Stop-loss must be above entry price.';
    }

    if (!isNaN(tp)) {
      if (isBuyMode && tp <= price) return 'Long: Take-profit must be above entry price.';
      if (!isBuyMode && tp >= price) return 'Short: Take-profit must be below entry price.';
    }

    const { userData } = getUserData();
    if (userData && userData.dashboard) {
      const currentBal = parseCurrency(userData.dashboard.balance);
      const margin = notional / leverage;
      const fee = notional * 0.001;

      if (!isBuyMode && leverage === 1) {
        // Spot Sell: Need sufficient crypto reserves
        const currentQty = userData.reserves ? (userData.reserves[currentAssetTicker] || 0) : 0;
        if (amount > currentQty) {
          return `Insufficient reserves to sell. You have ${currentQty.toFixed(4)} ${currentAssetTicker}.`;
        }
      } else {
        // Long or Margin Short: Need sufficient USD balance
        const required = margin + fee;
        if (required > currentBal) {
          return `Insufficient balance. Required: ${formatCurrency(required)}. Available: ${formatCurrency(currentBal)}.`;
        }
      }
      
      // Optional: Risk limit check
      let risk = 0;
      if (!isNaN(sl)) {
        risk = (isBuyMode ? (price - sl) : (sl - price)) * amount;
        if (risk > currentBal * 0.1) { // 10% risk rule example
           // Just a warning for paper trading, but we can enforce it.
           // return 'Risk exceeds 10% of available balance.';
        }
      }
    } else {
      return 'User session not found.';
    }

    return null; // Valid
  }

  // Handle trade buttons clicks
  tradeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!checkAuth()) return;

      const { userData } = getUserData();
      if (userData && userData.dashboard) {
        tradeWalletBalance.textContent = userData.dashboard.balance;
      }

      const card = btn.closest('.market-card');
      if (card) {
        currentAssetName = card.querySelector('.market-card__name').textContent.trim();
        currentAssetTicker = card.querySelector('.market-card__ticker').textContent.trim();
        const priceText = card.querySelector('.market-card__body .market-card__field-val').textContent.trim();
        currentAssetPrice = parseCurrency(priceText);
        
        // Set icon class
        const iconEl = card.querySelector('.market-card__icon');
        tradeAssetIcon.className = 'trade-dialog__asset-icon ' + (iconEl ? iconEl.className : '');
        tradeAssetIcon.innerHTML = iconEl ? iconEl.innerHTML : '';
      } else {
        // Row in table
        const row = btn.closest('tr');
        if (row) {
          currentAssetName = row.querySelector('.fw-semibold').textContent.trim();
          currentAssetTicker = currentAssetName;
          const priceText = row.querySelector('.price-cell').textContent.trim();
          currentAssetPrice = parseCurrency(priceText);
          
          // Set icon
          const iconEl = row.querySelector('.market-card__icon');
          tradeAssetIcon.className = 'trade-dialog__asset-icon ' + (iconEl ? iconEl.className : '');
          tradeAssetIcon.innerHTML = iconEl ? iconEl.innerHTML : '';
        }
      }

      // Populate modal
      tradeAssetTitle.textContent = currentAssetName;
      tradeAssetTicker.textContent = currentAssetTicker + '/USD';
      tradeCurrentPrice.textContent = formatCurrency(currentAssetPrice);
      tradeAmountLabel.textContent = `Amount (${currentAssetTicker})`;
      tradeAssetSuffix.textContent = currentAssetTicker;
      
      tradeLimitPrice.value = currentAssetPrice;
      tradeAmount.value = '';
      tradeNotional.value = '';
      tradeStopLoss.value = '';
      tradeTakeProfit.value = '';
      tradeLeverage.value = '1';
      tradeOrderType.value = 'market';
      limitPriceGroup.style.display = 'none';
      showError('');
      
      // Default tab is Long (Buy)
      isBuyMode = true;
      tradeTabs.forEach(t => t.classList.remove('active'));
      document.querySelector('.trade-tab[data-action="buy"]').classList.add('active');
      tradeSubmitBtn.className = 'btn btn-primary btn-full mt-4';
      tradeSubmitBtn.textContent = `Place Paper Trade`;

      updateReservesDisplay(userData);
      updateCalculations();
      
      tradeDialog.showModal();
    });
  });

  // Tabs click
  tradeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tradeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      isBuyMode = tab.getAttribute('data-action') === 'buy';

      if (isBuyMode) {
        tradeSubmitBtn.className = 'btn btn-primary btn-full mt-4';
      } else {
        tradeSubmitBtn.className = 'btn btn-danger btn-full mt-4';
      }
      updateCalculations();
    });
  });

  // Order type change
  tradeOrderType.addEventListener('change', () => {
    if (tradeOrderType.value === 'limit') {
      limitPriceGroup.style.display = 'flex';
    } else {
      limitPriceGroup.style.display = 'none';
    }
    updateCalculations();
  });

  // Input changes
  tradeAmount.addEventListener('input', () => syncInputs('amount'));
  tradeNotional.addEventListener('input', () => syncInputs('notional'));
  tradeLimitPrice.addEventListener('input', () => syncInputs('amount')); // re-sync based on new price
  tradeLeverage.addEventListener('change', updateCalculations);
  tradeStopLoss.addEventListener('input', updateCalculations);
  tradeTakeProfit.addEventListener('input', updateCalculations);

  // Close button & Click outside
  function closeDialog() {
    tradeDialog.close();
    showError('');
  }

  tradeCloseBtn.addEventListener('click', closeDialog);

  tradeDialog.addEventListener('click', (event) => {
    if (event.target === tradeDialog) {
      closeDialog();
    }
  });
  
  // Escape key support (handled natively by <dialog>, but good to catch cancel)
  tradeDialog.addEventListener('cancel', () => {
    closeDialog();
  });

  // Form Submit (Execute Trade)
  tradeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const errorMsg = validateOrder();
    if (errorMsg) {
      showError(errorMsg);
      // Accessibility focus shift to error message
      tradeErrorMsg.setAttribute('tabindex', '-1');
      tradeErrorMsg.focus();
      return;
    }

    const amount = parseFloat(tradeAmount.value);
    const notional = parseFloat(tradeNotional.value);
    const leverage = parseFloat(tradeLeverage.value) || 1;
    
    const margin = notional / leverage;
    const fee = notional * 0.001;
    const totalCost = margin + fee;

    const { currentUserEmail, usersData, userData } = getUserData();
    if (!userData) {
      showError('Error: User session not found. Please log in again.');
      return;
    }

    if (!userData.reserves) {
      userData.reserves = {
        'BTC': 0.5,
        'ETH': 10.0,
        'SOL': 150.0
      };
    }

    let balanceNum = parseCurrency(userData.dashboard.balance);
    const currentQty = userData.reserves[currentAssetTicker] || 0;
    
    // Process trade for Paper Trading Simulation
    if (!isBuyMode && leverage === 1) {
      // Spot Sell
      balanceNum += (notional - fee);
      userData.reserves[currentAssetTicker] = Math.max(0, currentQty - amount);
    } else {
      // Margin Trade (Long or Short)
      balanceNum -= totalCost;
      if (isBuyMode && leverage === 1) {
        // Spot Buy
        userData.reserves[currentAssetTicker] = currentQty + amount;
      }
      // If leverage > 1, it's a derivative, so reserves are untouched.
    }

    // Update userData
    userData.dashboard.balance = formatCurrency(balanceNum);

    // Add transaction history
    if (!userData.transactions) userData.transactions = [];
    const today = new Date().toISOString().split('T')[0];
    
    let transactionType = isBuyMode ? 'Long ' : 'Short ';
    if (leverage === 1) {
      transactionType = isBuyMode ? 'Buy ' : 'Sell ';
    }
    
    userData.transactions.unshift({
      date: today,
      type: transactionType + currentAssetTicker + (leverage > 1 ? ` (${leverage}x)` : ''),
      amount: (!isBuyMode && leverage === 1) ? ('+' + formatCurrency(notional - fee)) : ('-' + formatCurrency(totalCost)),
      status: leverage === 1 ? 'Completed' : 'Open Position'
    });

    // Save
    usersData[currentUserEmail] = userData;
    localStorage.setItem('usersData', JSON.stringify(usersData));

    // Close dialog
    closeDialog();

    // Show Toast
    toastMessage.textContent = `${isBuyMode ? 'Long' : 'Short'} ${amount} ${currentAssetTicker} placed successfully.`;
    if (isBuyMode) {
      tradeSuccessToast.classList.remove('sell-mode');
      tradeSuccessToast.querySelector('.toast-icon').innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    } else {
      tradeSuccessToast.classList.add('sell-mode');
      tradeSuccessToast.querySelector('.toast-icon').innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--danger)"></i>';
    }
    tradeSuccessToast.hidden = false;

    setTimeout(() => {
      tradeSuccessToast.style.animation = 'none';
      tradeSuccessToast.offsetHeight;
      tradeSuccessToast.style.animation = null;
    }, 10);

    setTimeout(() => {
      tradeSuccessToast.hidden = true;
    }, 4000);
  });
});
