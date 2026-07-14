function openTradeModal(assetName, ticker, priceStr) {
    const entryPrice = parseFloat(priceStr.toString().replace(/[^0-9.-]+/g, ""));
    
    const existing = document.getElementById('archon-trade-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'archon-trade-modal';
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 9998;
        background: rgba(11, 18, 32, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.3s ease;
    `;

    const iconHtml = ticker === 'BTC' ? '<i class="fa-brands fa-bitcoin"></i>' : ticker === 'ETH' ? '<i class="fa-brands fa-ethereum"></i>' : ticker === 'SOL' ? 'S' : '<i class="fa-solid fa-coins"></i>';
    const color = ticker === 'BTC' ? 'linear-gradient(135deg,#F7931A,#FF6B00)' : ticker === 'ETH' ? 'linear-gradient(135deg,#627EEA,#3D5AF1)' : ticker === 'SOL' ? 'linear-gradient(135deg,#9945FF,#14F195)' : 'linear-gradient(135deg,#555,#111)';

    modal.innerHTML = `
        <div style="
            background: var(--card-bg, #141C2F);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: var(--radius-2xl, 20px);
            width: 100%; max-width: 420px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
            transform: translateY(20px) scale(0.95);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
            font-family: var(--font-primary, sans-serif);
            color: #fff;
            margin: 16px;
        ">
            <!-- Header -->
            <div style="padding: 24px 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;">Buy Asset</h3>
                <button id="trade-modal-close" style="background: none; border: none; color: #6B7A93; cursor: pointer; font-size: 1.2rem; padding: 4px; border-radius: 4px; transition: color 0.2s;">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <!-- Body -->
            <div style="padding: 24px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px dashed rgba(255,255,255,0.08);">
                    <div style="width: 52px; height: 52px; border-radius: 50%; background: ${color}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; box-shadow: 0 8px 16px rgba(0,0,0,0.3);">
                        ${iconHtml}
                    </div>
                    <div>
                        <div style="font-size: 1.125rem; font-weight: 700;">${assetName}</div>
                        <div style="font-size: 0.875rem; color: #6B7A93; margin-top: 2px;">Current Price: <strong style="color: #fff; font-family: monospace;">${priceStr}</strong></div>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 0.875rem; color: #AAB4C5; margin-bottom: 8px; font-weight: 500;">Amount to Buy</label>
                    <div style="position: relative;">
                        <input type="number" id="trade-amount" value="1" step="0.01" min="0.01" style="
                            width: 100%; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1);
                            padding: 16px; border-radius: 12px; color: #fff; font-size: 1.125rem; font-weight: 600;
                            outline: none; box-sizing: border-box; font-family: monospace; transition: border-color 0.2s;
                        " onfocus="this.style.borderColor='rgba(0, 230, 118, 0.5)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                        <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #6B7A93; font-weight: 700;">
                            ${ticker}
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; background: rgba(0, 230, 118, 0.04); border: 1px solid rgba(0, 230, 118, 0.15); padding: 16px; border-radius: 12px;">
                    <span style="color: #AAB4C5; font-size: 0.875rem; font-weight: 500;">Total Investment</span>
                    <strong id="trade-total" style="color: #00E676; font-size: 1.25rem; font-family: monospace; letter-spacing: -0.02em;">$${entryPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</strong>
                </div>

                <button id="trade-confirm-btn" style="
                    width: 100%; background: linear-gradient(135deg, #00E676, #00C853);
                    color: #0B1220; border: none; padding: 16px; border-radius: 12px;
                    font-size: 1rem; font-weight: 800; cursor: pointer;
                    box-shadow: 0 8px 24px rgba(0,230,118,0.25); transition: all 0.2s ease;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 28px rgba(0,230,118,0.35)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(0,230,118,0.25)'">
                    Confirm Purchase
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    const inputAmount = document.getElementById('trade-amount');
    const totalDisplay = document.getElementById('trade-total');
    
    inputAmount.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value) || 0;
        let total = val * entryPrice;
        totalDisplay.innerText = '$' + total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
    });

    const closeBtn = document.getElementById('trade-modal-close');
    const closeModal = () => {
        modal.firstElementChild.style.transform = 'translateY(20px) scale(0.95)';
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    };
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

    const confirmBtn = document.getElementById('trade-confirm-btn');
    confirmBtn.addEventListener('click', () => {
        let val = parseFloat(inputAmount.value) || 1;
        // visual feedback on button
        confirmBtn.innerText = 'Processing...';
        confirmBtn.style.opacity = '0.8';
        setTimeout(() => {
            closeModal();
            placeTrade(assetName, ticker, priceStr, 'Long', val);
        }, 600); // slight delay for realism
    });

    // Animate in
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.firstElementChild.style.transform = 'translateY(0) scale(1)';
        // inputAmount.focus(); // optional autofocus
    });
}

function placeTrade(assetName, ticker, priceStr, type = 'Long', size = 1) {
    const entryPrice = parseFloat(priceStr.toString().replace(/[^0-9.-]+/g, ""));
    const trade = {
        id: Date.now(),
        assetName: assetName,
        ticker: ticker,
        type: type,
        size: size,
        entryPrice: entryPrice,
        currentPrice: entryPrice,
        timestamp: new Date().getTime()
    };

    let trades = JSON.parse(localStorage.getItem('archon_trades') || '[]');
    trades.push(trade);
    localStorage.setItem('archon_trades', JSON.stringify(trades));

    // Create premium toast notification
    const toast = document.createElement('div');
    toast.innerHTML = `
        <div style="
            position: fixed; 
            bottom: var(--space-8, 32px); 
            right: var(--space-8, 32px); 
            z-index: var(--z-toast, 9999);
            background: var(--card-bg, #141C2F);
            border: 1px solid rgba(0, 230, 118, 0.3);
            box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 8px 30px rgba(0,230,118,0.15);
            border-radius: var(--radius-xl, 16px);
            padding: var(--space-4, 16px) var(--space-5, 20px);
            display: flex;
            align-items: center;
            gap: var(--space-4, 16px);
            color: var(--text-primary, #fff);
            font-family: var(--font-primary, sans-serif);
            transform: translateY(100px) scale(0.95);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
            <div style="
                background: var(--grad-primary, linear-gradient(135deg, #00E676, #00C853));
                width: 44px; 
                height: 44px; 
                border-radius: var(--radius-full, 9999px);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                color: var(--text-inverse, #0B1220);
                box-shadow: 0 0 20px rgba(0, 230, 118, 0.4);
                flex-shrink: 0;
            ">
                <i class="fa-solid fa-check"></i>
            </div>
            <div>
                <div style="font-size: var(--text-base, 1rem); font-weight: var(--fw-bold, 700); margin-bottom: 4px;">Trade Executed</div>
                <div style="font-size: var(--text-sm, 0.875rem); color: var(--text-secondary, #AAB4C5); line-height: 1.4;">
                    Successfully bought <strong style="color: var(--text-primary, #fff);">${size} ${ticker}</strong> at <span style="font-family: var(--font-mono, monospace);">${priceStr}</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(toast);

    // Trigger spring animation
    requestAnimationFrame(() => {
        const toastEl = toast.firstElementChild;
        toastEl.style.transform = 'translateY(0) scale(1)';
        toastEl.style.opacity = '1';
    });

    // Update history table if we are on markets.html
    if (typeof window.renderMarketsHistory === 'function') {
        window.renderMarketsHistory();
    }

    // Dismiss toast gracefully after delay
    setTimeout(() => {
        const toastEl = toast.firstElementChild;
        toastEl.style.transform = 'translateY(20px) scale(0.95)';
        toastEl.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}
