document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Profile Toggle (Simplified for History Page)
  const profileMenuToggle = document.getElementById('profileMenuToggle');
  const profileDropdown = document.getElementById('profileDropdown');
  const logoutBtn = document.getElementById('logoutBtn');

  if (profileMenuToggle && profileDropdown) {
    profileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && e.target !== profileMenuToggle) {
        profileDropdown.classList.remove('show');
      }
    });
  }

  // Auth Check
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
    return;
  }

  const currentUserEmail = localStorage.getItem('currentUserEmail');
  let usersData = JSON.parse(localStorage.getItem('usersData') || '{}');
  let userData = usersData[currentUserEmail];

  if (userData) {
    // Populate user profile UI
    const userName = userData.name || 'User';
    const sidebarNameEl = document.querySelector('.sidebar__user-name');
    if (sidebarNameEl) sidebarNameEl.textContent = userName;
    
    const avatarEl = document.querySelector('.sidebar__user-avatar');
    if (avatarEl) {
      const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      avatarEl.textContent = initials;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUserEmail');
      window.location.href = 'index.html';
    });
  }

  // Trades Rendering Logic
  const tradeTableBody = document.getElementById('tradeTableBody');
  const tabActiveTrades = document.getElementById('tabActiveTrades');
  const tabOrderHistory = document.getElementById('tabOrderHistory');

  let currentFilter = 'Active'; // 'Active' or 'All'

  function renderTrades() {
    tradeTableBody.innerHTML = '';
    
    // Fetch freshest data
    usersData = JSON.parse(localStorage.getItem('usersData') || '{}');
    userData = usersData[currentUserEmail];
    
    const trades = userData && userData.trades ? userData.trades : [];

    let filteredTrades = trades;
    if (currentFilter === 'Active') {
      filteredTrades = trades.filter(t => t.status === 'Active');
    }

    if (filteredTrades.length === 0) {
      tradeTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No ${currentFilter === 'Active' ? 'active ' : ''}trades found.</td></tr>`;
      return;
    }

    filteredTrades.forEach(tx => {
      const tr = document.createElement('tr');
      
      let sideColor = tx.side === 'Buy' ? 'var(--primary)' : 'var(--danger)';
      let statusBg = tx.status === 'Active' ? 'rgba(0,230,118,0.1)' : 'rgba(41,98,255,0.1)';
      let statusColor = tx.status === 'Active' ? '#00e676' : '#2962ff';

      const dateStr = new Date(tx.timestamp).toLocaleString();
      const notionalStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.notional);
      const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.price);

      tr.innerHTML = `
        <td>${dateStr}</td>
        <td class="fw-semibold">${tx.asset}/USD</td>
        <td style="color: ${sideColor}; font-weight: 600;">${tx.side}</td>
        <td>${tx.amount}</td>
        <td>${priceStr}</td>
        <td>${notionalStr}</td>
        <td>${tx.leverage}x</td>
        <td>
          <span style="background:${statusBg}; color:${statusColor}; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:600;">
            ${tx.status}
          </span>
        </td>
      `;
      tradeTableBody.appendChild(tr);
    });
  }

  tabActiveTrades.addEventListener('click', () => {
    tabActiveTrades.classList.add('active');
    tabActiveTrades.style.color = 'var(--primary)';
    tabActiveTrades.style.borderBottom = '2px solid var(--primary)';
    
    tabOrderHistory.classList.remove('active');
    tabOrderHistory.style.color = 'var(--text-muted)';
    tabOrderHistory.style.borderBottom = 'none';

    currentFilter = 'Active';
    renderTrades();
  });

  tabOrderHistory.addEventListener('click', () => {
    tabOrderHistory.classList.add('active');
    tabOrderHistory.style.color = 'var(--primary)';
    tabOrderHistory.style.borderBottom = '2px solid var(--primary)';
    
    tabActiveTrades.classList.remove('active');
    tabActiveTrades.style.color = 'var(--text-muted)';
    tabActiveTrades.style.borderBottom = 'none';

    currentFilter = 'All';
    renderTrades();
  });

  // Initial Render
  renderTrades();
  
  // Listen for storage changes (e.g. trade placed in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'usersData') {
      renderTrades();
    }
  });

  // Re-render when page is restored from bfcache (back/forward navigation)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      renderTrades();
    }
  });

  // Re-render when a trade is placed within the same context
  window.addEventListener('tradeUpdated', () => {
    renderTrades();
  });
});
