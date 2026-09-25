/* FURSYS Rental Main Application Logic */

// Global Configuration
window.FURSYS_CONFIG = window.FURSYS_CONFIG || {
  GAS_API_URL: 'https://script.google.com/macros/s/AKfycbzS5tVHtDI1VAeyw9sCyvT_8OzUFvkJQmpoPLLSo3ArCIFJDeA9xtG_kUNWhsMRL4nIhg/exec', 
  CACHE_TTL_MS: 24 * 60 * 60 * 1000 // 24 Hours Cache TTL
};

// Default Fallback Data if fetch is blocked locally or offline
const LOCAL_PRODUCTS = [
  {
    "id": "CH-001",
    "category": "chair",
    "categoryName": "의자",
    "name": "퍼시스 T50 메쉬 의자 (T500HLDA)",
    "code": "T500HLDA",
    "spec": "W670 * D630 * H1160~1230",
    "image": "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 15000,
    "retailPrice": 380000,
    "status": "A급 (검수 완료)",
    "description": "인체공학적 멀티 틸팅 기능과 통기성 우수한 메쉬 소재의 퍼시스 대표 사무용 의자."
  },
  {
    "id": "CH-002",
    "category": "chair",
    "categoryName": "의자",
    "name": "퍼시스 CH4300 메쉬 사무용 의자",
    "code": "CH4300",
    "spec": "W640 * D580 * H980~1050",
    "image": "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 12000,
    "retailPrice": 290000,
    "status": "A급 (검수 완료)",
    "description": "슬림한 디자인과 뛰어난 요추 지지 기능을 갖춘 효율적인 팀원용 의자."
  },
  {
    "id": "CH-003",
    "category": "chair",
    "categoryName": "의자",
    "name": "퍼시스 지엘(ZEAL) 중역용 가죽 의자",
    "code": "CHN4600",
    "spec": "W700 * D720 * H1180~1250",
    "image": "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 28000,
    "retailPrice": 750000,
    "status": "S급 (신품급)",
    "description": "천연 가죽의 품격과 최고급 싱크로나이즈드 틸팅이 적용된 임원 전용 가죽 의자."
  },
  {
    "id": "DK-001",
    "category": "desk",
    "categoryName": "데스크/책상",
    "name": "퍼시스 인에이블(ENABLE) 일자형 데스크",
    "code": "FDD014",
    "spec": "W1400 * D700 * H720",
    "image": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 18000,
    "retailPrice": 420000,
    "status": "A급 (검수 완료)",
    "description": "덕트형 배선 처리구와 덕트 커버가 포함된 모던 오피스 대표 일자형 책상."
  },
  {
    "id": "DK-002",
    "category": "desk",
    "categoryName": "데스크/책상",
    "name": "퍼시스 모션데스크 (전동 모션데스크)",
    "code": "FDM016",
    "spec": "W1600 * D800 * H650~1250",
    "image": "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 35000,
    "retailPrice": 980000,
    "status": "S급 (신품급)",
    "description": "높낮이 조절 메모리 기능이 탑재된 스탠딩 워크 지원 전동 리프트 모션데스크."
  },
  {
    "id": "ST-001",
    "category": "storage",
    "categoryName": "서랍/수납",
    "name": "퍼시스 3단 이동식 슬림 쇠서랍",
    "code": "FP3",
    "spec": "W300 * D550 * H610",
    "image": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 6000,
    "retailPrice": 180000,
    "status": "A급 (검수 완료)",
    "description": "잠금장치가 포함된 서류 및 소품 보관용 잠금식 3단 이동 서랍장."
  },
  {
    "id": "MT-001",
    "category": "table",
    "categoryName": "회의/테이블",
    "name": "퍼시스 비콘(BEACON) 6인용 회의 테이블",
    "code": "FMT2412",
    "spec": "W2400 * D1200 * H720",
    "image": "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 32000,
    "retailPrice": 890000,
    "status": "A급 (검수 완료)",
    "description": "중앙 매립형 멀티탭 멀티 덕트가 기본 장착된 6~8인용 프리미엄 회의 테이블."
  },
  {
    "id": "PT-001",
    "category": "partition",
    "categoryName": "파티션",
    "name": "퍼시스 블록 파티션 H1200 (패브릭)",
    "code": "PT1200",
    "spec": "W1000 * H1200 * T45",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 5000,
    "retailPrice": 120000,
    "status": "A급 (검수 완료)",
    "description": "좌식 시선 차단 및 독립적 공간 구획을 위한 고급 흡음 패브릭 파티션."
  },
  {
    "id": "LG-001",
    "category": "lounge",
    "categoryName": "라운지/소파",
    "name": "퍼시스 스퀘어 1인용 소파",
    "code": "CS101",
    "spec": "W800 * D750 * H700",
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    "monthlyFee": 20000,
    "retailPrice": 480000,
    "status": "S급 (신품급)",
    "description": "접객실 및 휴게 라운지에 적합한 모던 스타일 1인 쿠션 소파."
  }
];

// 1. Product 24-Hour LocalStorage Cache Engine
const ProductCacheManager = {
  CACHE_KEY: 'fursys_products_cache',
  TIME_KEY: 'fursys_products_cache_time',
  SOURCE_KEY: 'fursys_products_cache_source',

  getCache() {
    try {
      const dataStr = localStorage.getItem(this.CACHE_KEY);
      const timeStr = localStorage.getItem(this.TIME_KEY);
      const source = localStorage.getItem(this.SOURCE_KEY) || 'Local Cache';

      if (!dataStr || !timeStr) return null;

      const cacheTime = parseInt(timeStr, 10);
      const now = Date.now();
      
      // Check if cache is still valid within 24 hours
      if (now - cacheTime < window.FURSYS_CONFIG.CACHE_TTL_MS) {
        const products = JSON.parse(dataStr);
        return { products, cacheTime, source };
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  setCache(products, source = 'Google Sheets DB') {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(products));
      localStorage.setItem(this.TIME_KEY, Date.now().toString());
      localStorage.setItem(this.SOURCE_KEY, source);
    } catch (e) {
      console.warn('LocalStorage Cache write failed:', e);
    }
  },

  clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.TIME_KEY);
    localStorage.removeItem(this.SOURCE_KEY);
  },

  async loadProducts(forceRefresh = false) {
    // 1. Check Local Cache first (if not forced refresh)
    if (!forceRefresh) {
      const cached = this.getCache();
      if (cached && cached.products.length > 0) {
        return { products: cached.products, source: `${cached.source} (1일 캐싱)`, isCached: true };
      }
    }

    // 2. Try fetching from Google Apps Script Exec API if configured
    if (window.FURSYS_CONFIG.GAS_API_URL) {
      try {
        const res = await fetch(window.FURSYS_CONFIG.GAS_API_URL);
        if (res.ok) {
          const gasProducts = await res.json();
          if (Array.isArray(gasProducts) && gasProducts.length > 0) {
            this.setCache(gasProducts, 'Google Sheets DB (Live)');
            return { products: gasProducts, source: 'Google Sheets DB (실시간)', isCached: false };
          }
        }
      } catch (err) {
        console.warn('GAS Fetch failed, falling back to local JSON:', err);
      }
    }

    // 3. Fallback to local products.json
    try {
      const res = await fetch('data/products.json');
      if (res.ok) {
        const localData = await res.json();
        if (Array.isArray(localData) && localData.length > 0) {
          this.setCache(localData, 'products.json');
          return { products: localData, source: '초절약 정적 DB (products.json)', isCached: false };
        }
      }
    } catch (err) {
      console.warn('Local products.json fetch failed:', err);
    }

    // 4. Ultimate Fallback to Hardcoded LOCAL_PRODUCTS
    return { products: LOCAL_PRODUCTS, source: '내장 기본 카탈로그', isCached: true };
  }
};

// 2. Cart State Manager
const CartState = {
  KEY: 'fursys_rental_cart',
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch (e) {
      return [];
    }
  },
  saveCart(cart) {
    localStorage.setItem(this.KEY, JSON.stringify(cart));
    this.updateBadge();
  },
  addItem(product, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }
    this.saveCart(cart);
  },
  removeItem(id) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== id);
    this.saveCart(cart);
  },
  updateQty(id, qty) {
    const cart = this.getCart();
    const target = cart.find(item => item.id === id);
    if (target) {
      target.qty = Math.max(1, qty);
      this.saveCart(cart);
    }
  },
  clearCart() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },
  getTotalCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.qty, 0);
  },
  getTotalMonthlyFee() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.monthlyFee * item.qty), 0);
  },
  updateBadge() {
    const badgeElements = document.querySelectorAll('.js-cart-count');
    const count = this.getTotalCount();
    badgeElements.forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.style.display = 'inline-block';
      } else {
        el.style.display = 'none';
      }
    });
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  CartState.updateBadge();
  initKakaoWidget();
  initFloatingCartBar();
  initFaqAccordion();
  initOfficeCalculator();

  // Mobile Drawer Toggle
  const openMenuBtn = document.querySelector('.js-fursys-rental-menu-open');
  const closeMenuBtns = document.querySelectorAll('.js-fursys-rental-menu-close');
  const mobileMenu = document.getElementById('rental-portal-mobile-menu');

  if (openMenuBtn && mobileMenu) {
    openMenuBtn.addEventListener('click', () => {
      mobileMenu.style.display = 'block';
    });
  }

  closeMenuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.style.display = 'none';
    });
  });

  // Quiz Finder Handler (on Index page)
  initQuizFinder();

  // Catalog Handler (on short-term-operation.html)
  initCatalogPage();

  // Inquiry Form Handler (on inquiry.html)
  initInquiryPage();
});

// Quiz Finder Logic
function initQuizFinder() {
  const questionsContainer = document.querySelector('.js-rental-finder-questions');
  if (!questionsContainer) return;

  const qShort = document.querySelector('.js-rental-finder-question[data-question="short"]');
  const qScale = document.querySelector('.js-rental-finder-question[data-question="scale"]');
  const qCare = document.querySelector('.js-rental-finder-question[data-question="care"]');
  const resultCard = document.querySelector('.js-rental-finder-result');
  const resultTitle = document.querySelector('.js-rental-finder-result-title');
  const resultDesc = document.querySelector('.js-rental-finder-result-description');
  const btnInquiry = document.querySelector('.js-rental-finder-result-inquiry');
  const btnDetail = document.querySelector('.js-rental-finder-result-detail');
  const btnReset = document.querySelector('.js-rental-finder-reset');

  const showQuestion = (element) => {
    [qShort, qScale, qCare].forEach(q => q && q.classList.add('hidden'));
    if (element) element.classList.remove('hidden');
  };

  const showResult = (type) => {
    if (questionsContainer) questionsContainer.classList.add('hidden');
    if (resultCard) resultCard.classList.remove('hidden');
    if (btnReset) btnReset.classList.remove('hidden');

    if (type === 'short') {
      resultTitle.textContent = '중고 단기 렌탈 (단기 운용)';
      resultDesc.textContent = '행사, 프로젝트, 임시 사무실 등 1년 미만 기간에 꼭 맞춘 합리적인 중고 가구 렌탈 솔루션입니다.';
      btnInquiry.href = 'inquiry.html?type=short';
      btnDetail.href = 'short-term-operation.html';
    } else if (type === 'care') {
      resultTitle.textContent = '신품 장기 구독 (퍼시스 공식 파트너 관리)';
      resultDesc.textContent = '3·4·5년 약정으로 공간 컨설팅, 배송·설치, 의자 클리닝 및 자산 관리까지 포함된 프리미엄 구독 방식입니다.';
      btnInquiry.href = 'inquiry.html?type=care';
      btnDetail.href = 'fursys-official-partner-management.html';
    } else {
      resultTitle.textContent = '신품 장기 렌탈 (렌탈사 통합 관리)';
      resultDesc.textContent = '렌탈사 금융 조건에 맞춰 초기 지출 부담을 최소화하고 신품 퍼시스 사무가구를 구비할 수 있는 렌탈 솔루션입니다.';
      btnInquiry.href = 'inquiry.html?type=general';
      btnDetail.href = 'rental-company-integrated-management.html';
    }
  };

  if (qShort) {
    qShort.querySelectorAll('.js-rental-finder-answer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ans = e.currentTarget.dataset.answer;
        if (ans === 'yes') {
          showResult('short');
        } else {
          showQuestion(qScale);
        }
      });
    });
  }

  if (qScale) {
    qScale.querySelectorAll('.js-rental-finder-answer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ans = e.currentTarget.dataset.answer;
        if (ans === 'yes') {
          showQuestion(qCare);
        } else {
          showResult('general');
        }
      });
    });
  }

  if (qCare) {
    qCare.querySelectorAll('.js-rental-finder-answer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ans = e.currentTarget.dataset.answer;
        if (ans === 'yes') {
          showResult('care');
        } else {
          showResult('general');
        }
      });
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (questionsContainer) questionsContainer.classList.remove('hidden');
      if (resultCard) resultCard.classList.add('hidden');
      btnReset.classList.add('hidden');
      showQuestion(qShort);
    });
  }
}

// Catalog Page Handler with GAS & LocalStorage 1-Day Cache Integration
async function initCatalogPage() {
  const gridContainer = document.getElementById('catalog-products-grid');
  if (!gridContainer) return;

  const syncBadge = document.getElementById('catalog-sync-status');
  const syncBtn = document.getElementById('catalog-sync-btn');
  const categoryBtns = document.querySelectorAll('.js-cat-btn');
  const searchInput = document.getElementById('catalog-search-input');

  let products = [];
  let activeCategory = 'all';
  let searchQuery = '';

  const loadAndRender = async (forceRefresh = false) => {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--fursys-text-muted);">
        <p style="font-size: 1.1rem; font-weight: 500;">577개 가구 상품 데이터 로딩 중...</p>
      </div>
    `;

    const result = await ProductCacheManager.loadProducts(forceRefresh);
    products = result.products;

    if (syncBadge) {
      syncBadge.textContent = `데이터 출처: ${result.source} (${products.length}개 상품)`;
      syncBadge.style.display = 'inline-block';
    }

    renderProducts();
  };

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeCategory = e.currentTarget.dataset.category;
      renderProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      showToast('Google Sheets DB 최신 데이터를 재동기화하는 중...');
      await loadAndRender(true);
      showToast('최신 데이터 동기화 완료!');
    });
  }

  function renderProducts() {
    gridContainer.innerHTML = '';

    const filtered = products.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery) || (p.code && p.code.toLowerCase().includes(searchQuery)) || (p.description && p.description.toLowerCase().includes(searchQuery));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--fursys-text-muted);">
          <p style="font-size: 1.2rem; font-weight: 500;">검색 결과와 일치하는 가구 제품이 없습니다.</p>
          <p style="margin-top: 0.5rem;">다른 카테고리나 검색어로 다시 시도해 주세요.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-img-wrapper js-open-detail" style="cursor: pointer;">
          <img src="${item.image || 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=600'}" alt="${item.name}" class="product-img" loading="lazy">
        </div>
        <div class="product-body">
          <span class="product-cat">${item.categoryName || '사무가구'} | ${item.status || '검수 완료'}</span>
          <h3 class="product-title js-open-detail" style="cursor: pointer;">${item.name}</h3>
          <p class="product-spec">규격: ${item.spec || '규격 정보'}</p>
          <p style="font-size: 0.85rem; color: var(--fursys-text-muted); margin-top: 0.5rem; line-height: 1.4;">${item.description || ''}</p>
          <div class="product-price-box">
            <div>
              <span class="monthly-price">월 ${Number(item.monthlyFee || 0).toLocaleString()}원</span>
              <span class="monthly-unit">/ VAT 별도</span>
            </div>
            <button class="btn-primary js-add-cart-btn" style="padding: 0.5rem 0.85rem; font-size: 0.85rem;" data-id="${item.id}">
              담기 +
            </button>
          </div>
        </div>
      `;

      card.querySelectorAll('.js-open-detail').forEach(el => {
        el.addEventListener('click', () => openProductDetailModal(item));
      });

      card.querySelector('.js-add-cart-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        CartState.addItem(item, 1);
        showToast(`${item.name} 이(가) 견적 장바구니에 담겼습니다.`);
      });

      gridContainer.appendChild(card);
    });
  }

  // Initial Load
  await loadAndRender(false);
}

// Inquiry Page Handler (Form Submission & Receipt Modal)
function initInquiryPage() {
  const inquiryForm = document.getElementById('rental-inquiry-form');
  const cartSummaryBox = document.getElementById('inquiry-cart-summary');
  const dropzoneBox = document.getElementById('inquiry-dropzone');
  const fileInput = document.getElementById('inquiry-file-input');
  const fileNameDisplay = document.getElementById('inquiry-file-name');

  if (!inquiryForm) return;

  // Dropzone File Upload Handler
  if (dropzoneBox && fileInput) {
    dropzoneBox.addEventListener('click', () => fileInput.click());

    dropzoneBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzoneBox.style.borderColor = 'var(--fursys-black)';
      dropzoneBox.style.backgroundColor = 'var(--fursys-light-gray)';
    });

    dropzoneBox.addEventListener('dragleave', () => {
      dropzoneBox.style.borderColor = 'var(--fursys-border)';
      dropzoneBox.style.backgroundColor = 'transparent';
    });

    dropzoneBox.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzoneBox.style.borderColor = 'var(--fursys-border)';
      dropzoneBox.style.backgroundColor = 'transparent';
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        updateFileDisplay(fileInput.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        updateFileDisplay(fileInput.files[0]);
      }
    });
  }

  function updateFileDisplay(file) {
    if (!fileNameDisplay || !file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    fileNameDisplay.innerHTML = `📄 <strong>${file.name}</strong> (${sizeMb} MB 업로드 준비 완료)`;
    fileNameDisplay.style.color = '#166534';
  }

  // Render selected cart items
  const cart = CartState.getCart();
  if (cartSummaryBox) {
    if (cart.length > 0) {
      let summaryHtml = `
        <div style="background-color: var(--fursys-light-gray); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">선택된 단기 렌탈 상품 (${CartState.getTotalCount()}개)</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
      `;
      cart.forEach(item => {
        summaryHtml += `
          <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--fursys-border); padding-bottom: 0.35rem;">
            <span>• ${item.name} (${item.qty}개)</span>
            <span style="font-weight: 600;">월 ${(item.monthlyFee * item.qty).toLocaleString()}원</span>
          </li>
        `;
      });
      summaryHtml += `
          </ul>
          <div style="display: flex; justify-content: space-between; margin-top: 0.75rem; font-weight: 700; font-size: 1rem;">
            <span>총 예상 월 렌탈료</span>
            <span style="color: var(--fursys-black);">월 ${CartState.getTotalMonthlyFee().toLocaleString()}원 (VAT 별도)</span>
          </div>
        </div>
      `;
      cartSummaryBox.innerHTML = summaryHtml;
    } else {
      cartSummaryBox.innerHTML = `
        <div style="background-color: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; border: 1px dashed var(--fursys-border); font-size: 0.9rem; color: var(--fursys-text-muted);">
          <span>💡 선택된 가구가 없습니다. 가구 수량 선택이 필요한 경우 단기 운용 카탈로그에서 먼저 제품을 담으실 수 있습니다.</span>
        </div>
      `;
    }
  }

  // Form Submission Handler
  inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const companyName = document.getElementById('inquiry-company')?.value || '';
    const managerName = document.getElementById('inquiry-name')?.value || '';
    const phone = document.getElementById('inquiry-phone')?.value || '';
    const email = document.getElementById('inquiry-email')?.value || '';
    const rentalType = document.getElementById('inquiry-type')?.value || '단기 운용 (중고)';
    const duration = document.getElementById('inquiry-duration')?.value || '12';
    const notes = document.getElementById('inquiry-notes')?.value || '';
    const uploadedFile = fileInput?.files[0]?.name || '첨부파일 없음';

    const timestampStr = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const inquiryNo = `FR-${timestampStr}`;

    const payload = {
      inquiryNo,
      companyName,
      managerName,
      phone,
      email,
      rentalType,
      duration,
      notes,
      fileName: uploadedFile,
      cart: CartState.getCart(),
      totalMonthlyFee: CartState.getTotalMonthlyFee()
    };

    // Post to GAS if endpoint is available
    if (window.FURSYS_CONFIG.GAS_API_URL) {
      try {
        await fetch(window.FURSYS_CONFIG.GAS_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Webhook post notification error:', err);
      }
    }

    // Populate Receipt Modal
    const receiptNo = document.getElementById('modal-receipt-no');
    const receiptCompany = document.getElementById('modal-receipt-company');
    const receiptTotal = document.getElementById('modal-receipt-total');

    if (receiptNo) receiptNo.textContent = inquiryNo;
    if (receiptCompany) receiptCompany.textContent = `${companyName} (${managerName} 담당자님)`;
    if (receiptTotal) receiptTotal.textContent = `월 ${CartState.getTotalMonthlyFee().toLocaleString()}원 (VAT 별도)`;

    const modal = document.getElementById('inquiry-success-modal');
    if (modal) {
      modal.style.display = 'flex';
    } else {
      alert(`[접수 완료] 접수번호: ${inquiryNo}\n문의가 성공적으로 접수되었습니다. 담당 파트너가 안내해 드리겠습니다.`);
    }

    CartState.clearCart();
    inquiryForm.reset();
    if (fileNameDisplay) fileNameDisplay.innerHTML = '';
  });
}

// Simple Toast Notification
function showToast(message) {
  let toast = document.getElementById('fursys-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fursys-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 6rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--fursys-black);
      color: var(--fursys-white);
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2500);
}

// Kakao Floating Widget Renderer
function initKakaoWidget() {
  if (document.getElementById('fursys-kakao-widget')) return;

  const widget = document.createElement('div');
  widget.id = 'fursys-kakao-widget';
  widget.className = 'kakao-float-widget';
  widget.innerHTML = `
    <div class="kakao-float-tooltip">⚡ 2시간 내 맞춤 견적 안내</div>
    <a href="http://pf.kakao.com/_AxecPxb/chat" target="_blank" rel="noopener" class="kakao-float-btn" aria-label="카카오톡 1:1 상담">
      K
    </a>
  `;
  document.body.appendChild(widget);
}

// Floating Cart Bar & Slide-over Drawer
function initFloatingCartBar() {
  let cartBar = document.getElementById('fursys-floating-cart-bar');
  if (!cartBar) {
    cartBar = document.createElement('div');
    cartBar.id = 'fursys-floating-cart-bar';
    cartBar.className = 'floating-cart-bar';
    cartBar.style.display = 'none';
    document.body.appendChild(cartBar);
  }

  const updateCartBar = () => {
    const count = CartState.getTotalCount();
    const totalFee = CartState.getTotalMonthlyFee();

    if (count > 0) {
      cartBar.style.display = 'flex';
      cartBar.innerHTML = `
        <span>🛒 견적 장바구니 <strong>${count}개</strong> 품목 선택됨</span>
        <span style="color: #fde047; font-weight: 700;">월 ${totalFee.toLocaleString()}원</span>
        <span style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">견적서 보기 →</span>
      `;
    } else {
      cartBar.style.display = 'none';
    }
  };

  cartBar.addEventListener('click', () => openCartDrawer());

  // Override CartState.saveCart to update Floating Cart Bar
  const originalSaveCart = CartState.saveCart.bind(CartState);
  CartState.saveCart = function(cart) {
    originalSaveCart(cart);
    updateCartBar();
  };

  updateCartBar();
}

// Slide-over Cart Drawer
function openCartDrawer() {
  let overlay = document.getElementById('fursys-cart-slideover');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'fursys-cart-slideover';
    overlay.className = 'slideover-overlay';
    document.body.appendChild(overlay);
  }

  const cart = CartState.getCart();
  const totalCount = CartState.getTotalCount();
  const totalMonthlyFee = CartState.getTotalMonthlyFee();

  let drawerItemsHtml = '';
  if (cart.length === 0) {
    drawerItemsHtml = `<p style="text-align:center; color: var(--fursys-text-muted); margin-top: 3rem;">담긴 가구가 없습니다.</p>`;
  } else {
    cart.forEach(item => {
      drawerItemsHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--fursys-border); padding: 0.85rem 0;">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${item.name}</div>
            <div style="font-size: 0.8rem; color: var(--fursys-text-muted);">월 ${item.monthlyFee.toLocaleString()}원 x ${item.qty}개 = <strong>월 ${(item.monthlyFee * item.qty).toLocaleString()}원</strong></div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <button onclick="CartState.updateQty('${item.id}', ${item.qty - 1}); openCartDrawer();" style="padding: 0.15rem 0.5rem; border: 1px solid var(--fursys-border); border-radius: 4px; background: none;">-</button>
            <span style="font-size: 0.9rem; font-weight: 600; min-width: 1.2rem; text-align: center;">${item.qty}</span>
            <button onclick="CartState.updateQty('${item.id}', ${item.qty + 1}); openCartDrawer();" style="padding: 0.15rem 0.5rem; border: 1px solid var(--fursys-border); border-radius: 4px; background: none;">+</button>
            <button onclick="CartState.removeItem('${item.id}'); openCartDrawer();" style="margin-left: 0.5rem; color: #ef4444; background: none; border: none; cursor: pointer; font-size: 0.8rem;">삭제</button>
          </div>
        </div>
      `;
    });
  }

  overlay.innerHTML = `
    <div class="slideover-drawer" onclick="event.stopPropagation()">
      <div style="padding: 1.25rem; border-bottom: 1px solid var(--fursys-border); display: flex; justify-content: space-between; align-items: center; background: var(--fursys-black); color: var(--fursys-white);">
        <h3 style="font-size: 1.15rem; font-weight: 700;">🛒 실시간 견적 장바구니 (${totalCount}개)</h3>
        <button onclick="document.getElementById('fursys-cart-slideover').style.display='none'" style="background: none; border: none; color: var(--fursys-white); font-size: 1.5rem; cursor: pointer;">✕</button>
      </div>
      
      <div style="padding: 1.25rem; flex: 1; overflow-y: auto;">
        ${drawerItemsHtml}
      </div>

      <div style="padding: 1.25rem; border-top: 2px solid var(--fursys-border); background: var(--fursys-light-gray);">
        <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">
          <span>총 예상 월 렌탈료</span>
          <span>월 ${totalMonthlyFee.toLocaleString()}원 <small style="font-size: 0.75rem; font-weight: 400; color: var(--fursys-text-muted);">(VAT 별도)</small></span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.35rem;">
          <button onclick="printOfficialProposal()" class="btn-primary" style="background: #334155; font-size: 0.8rem; padding: 0.65rem;">견적서 인쇄 🖨️</button>
          <button onclick="exportCartToCsv()" class="btn-primary" style="background: #166534; font-size: 0.8rem; padding: 0.65rem;">엑셀 다운 📊</button>
          <a href="inquiry.html" class="btn-primary" style="font-size: 0.8rem; padding: 0.65rem; text-align: center; text-decoration: none;">문의 접수 →</a>
        </div>
      </div>
    </div>
  `;

  overlay.style.display = 'flex';
  overlay.onclick = () => overlay.style.display = 'none';
}

// Print Official FURSYS Rental Proposal Sheet
function printOfficialProposal() {
  const cart = CartState.getCart();
  if (cart.length === 0) {
    alert('장바구니에 담긴 가구가 없습니다. 가구를 먼저 선택해 주세요.');
    return;
  }

  const printWindow = window.open('', '_blank');
  const todayStr = new Date().toISOString().split('T')[0];

  let itemsRowsHtml = '';
  cart.forEach((item, idx) => {
    itemsRowsHtml += `
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${idx + 1}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${item.name} (${item.code || '-'})</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${item.spec || '-'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${item.status || '검수 완료'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">${item.qty}개</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">월 ${item.monthlyFee.toLocaleString()}원</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-weight: bold;">월 ${(item.monthlyFee * item.qty).toLocaleString()}원</td>
      </tr>
    `;
  });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>퍼시스 렌탈 정식 견적서</title>
      <style>
        body { font-family: sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
        .title { font-size: 24px; font-weight: bold; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
        th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 10px; font-weight: 600; }
        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">FURSYS Rental 정식 견적서</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">발행일자: ${todayStr} | 문서번호: FR-EST-${Date.now().toString().slice(-6)}</div>
        </div>
        <div style="text-align: right; font-size: 13px;">
          <strong>공급자: 퍼시스 공식 파트너 정진덕 OC</strong><br>
          사업자: 퍼시스 렌탈 지정 파트너십<br>
          연락처: 1588-0000 | 카카오톡: 정진덕 OC
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; font-size: 14px; margin-bottom: 20px;">
        <strong>견적 개요:</strong> 본 견적서는 고객님이 선택하신 퍼시스 가구 단기/장기 렌탈 예상 견적서입니다.<br>
        <strong>총 예상 월 렌탈료:</strong> <span style="font-size: 18px; color: #2563eb; font-weight: bold;">월 ${CartState.getTotalMonthlyFee().toLocaleString()}원</span> (VAT 별도 / 배송·설치비 조건 협의)
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px;">No</th>
            <th>품명 및 모델명</th>
            <th>규격 (W*D*H)</th>
            <th style="width: 90px;">상태</th>
            <th style="width: 60px;">수량</th>
            <th style="width: 100px;">월 렌탈단가</th>
            <th style="width: 120px;">월 렌탈료 합계</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
        </tbody>
      </table>

      <div class="footer">
        © 2026 FURSYS Partner Jeong Jin-Deok OC. 본 견적서는 브라우저 사전 확인용 정식 렌탈 견적서입니다.
      </div>
      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Product Detail Slide-over Modal & Dynamic Discount Calculator
function openProductDetailModal(product) {
  let modal = document.getElementById('fursys-product-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'fursys-product-detail-modal';
    modal.className = 'slideover-overlay';
    document.body.appendChild(modal);
  }

  const baseFee = product.monthlyFee;

  const updateSimulatedFee = (months) => {
    let discount = 1.0;
    if (months >= 24) discount = 0.85;
    else if (months >= 12) discount = 0.90;
    else if (months >= 6) discount = 0.95;

    const calcFee = Math.round((baseFee * discount) / 100) * 100;
    const totalContract = calcFee * months;

    const feeElem = document.getElementById('modal-calc-monthly');
    const totalElem = document.getElementById('modal-calc-total');
    const discountElem = document.getElementById('modal-calc-discount');

    if (feeElem) feeElem.textContent = `월 ${calcFee.toLocaleString()}원`;
    if (totalElem) totalElem.textContent = `${months}개월 총 약 ${totalContract.toLocaleString()}원 (VAT 별도)`;
    if (discountElem) discountElem.textContent = discount < 1.0 ? `(${Math.round((1 - discount)*100)}% 장기 약정 할인 적용)` : '(기본 단기 요금)';
  };

  modal.innerHTML = `
    <div class="slideover-drawer" style="max-width: 540px;" onclick="event.stopPropagation()">
      <div style="padding: 1.25rem; border-bottom: 1px solid var(--fursys-border); display: flex; justify-content: space-between; align-items: center; background: var(--fursys-black); color: var(--fursys-white);">
        <h3 style="font-size: 1.1rem; font-weight: 700;">${product.name}</h3>
        <button onclick="document.getElementById('fursys-product-detail-modal').style.display='none'" style="background: none; border: none; color: var(--fursys-white); font-size: 1.5rem; cursor: pointer;">✕</button>
      </div>

      <div style="padding: 1.5rem; flex: 1; overflow-y: auto;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
        
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
          <span style="background: var(--fursys-light-gray); padding: 0.25rem 0.65rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">${product.categoryName || '사무가구'}</span>
          <span style="background: #dcfce7; color: #166534; padding: 0.25rem 0.65rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">${product.status || 'A급 검수 완료'}</span>
          <span style="background: #f1f5f9; padding: 0.25rem 0.65rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">코드: ${product.code || '-'}</span>
        </div>

        <p style="font-size: 0.95rem; color: var(--fursys-text-muted); line-height: 1.6; margin-bottom: 1.5rem;">${product.description}</p>
        <p style="font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 1.5rem;">📐 제품 규격: ${product.spec}</p>

        <!-- Dynamic Duration Slider -->
        <div style="background: #f8fafc; border: 1px solid var(--fursys-border); padding: 1.25rem; border-radius: 8px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">⏱️ 사용 희망 기간별 렌탈료 시뮬레이션</h4>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--fursys-text-muted); margin-bottom: 0.5rem;">
            <span>1개월</span>
            <span id="modal-months-label" style="font-weight: 700; color: var(--fursys-black);">12개월 선택</span>
            <span>36개월</span>
          </div>
          <input type="range" id="modal-duration-slider" min="1" max="36" value="12" style="width: 100%; accent-color: var(--fursys-black); cursor: pointer;">
          
          <div style="margin-top: 1rem; text-align: right;">
            <div id="modal-calc-monthly" style="font-size: 1.35rem; font-weight: 800; color: #2563eb;">월 ${product.monthlyFee.toLocaleString()}원</div>
            <div id="modal-calc-discount" style="font-size: 0.75rem; color: #166534; font-weight: 600;">(10% 할인 적용)</div>
            <div id="modal-calc-total" style="font-size: 0.8rem; color: var(--fursys-text-muted); margin-top: 0.25rem;">12개월 약정 총액 계산 중</div>
          </div>
        </div>
      </div>

      <div style="padding: 1.25rem; border-top: 1px solid var(--fursys-border); background: var(--fursys-white); display: flex; gap: 0.5rem;">
        <button id="modal-add-cart-btn" class="btn-primary" style="flex: 1; padding: 0.85rem;">장바구니 담기 +</button>
        <a href="inquiry.html" class="btn-primary" style="flex: 1; background: var(--fursys-black); text-align: center; text-decoration: none; padding: 0.85rem;">즉시 문의하기</a>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  modal.onclick = () => modal.style.display = 'none';

  const slider = document.getElementById('modal-duration-slider');
  const monthsLabel = document.getElementById('modal-months-label');
  if (slider) {
    slider.addEventListener('input', (e) => {
      const months = parseInt(e.target.value, 10);
      if (monthsLabel) monthsLabel.textContent = `${months}개월 선택`;
      updateSimulatedFee(months);
    });
    updateSimulatedFee(12);
  }

  document.getElementById('modal-add-cart-btn')?.addEventListener('click', () => {
    CartState.addItem(product, 1);
    showToast(`${product.name}이(가) 장바구니에 담겼습니다.`);
    modal.style.display = 'none';
  });
}

// FAQ Accordion Handler
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.js-faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });
}

// Export Cart to CSV File for Purchasing Teams
function exportCartToCsv() {
  const cart = CartState.getCart();
  if (cart.length === 0) {
    alert('장바구니에 담긴 가구가 없습니다.');
    return;
  }

  let csvContent = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  csvContent += "No,카테고리,상품명,모델코드,규격,상태,수량,월 렌탈단가(원),월 렌탈료합계(원)\n";

  cart.forEach((item, idx) => {
    const nameStr = `"${(item.name || '').replace(/"/g, '""')}"`;
    const specStr = `"${(item.spec || '').replace(/"/g, '""')}"`;
    const monthlyTotal = item.monthlyFee * item.qty;
    csvContent += `${idx + 1},${item.categoryName || ''},${nameStr},${item.code || ''},${specStr},${item.status || '검수완료'},${item.qty},${item.monthlyFee},${monthlyTotal}\n`;
  });

  csvContent += `\n,,,,,총 예상 월 렌탈료,,${CartState.getTotalMonthlyFee()} (VAT별도)\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FURSYS_Rental_Quote_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Office Scale & Staff Furniture Calculator
function initOfficeCalculator() {
  const staffInput = document.getElementById('calc-staff-count');
  const calcBtn = document.getElementById('calc-run-btn');
  const resultBox = document.getElementById('calc-result-box');

  if (!calcBtn || !staffInput) return;

  calcBtn.addEventListener('click', () => {
    const staff = parseInt(staffInput.value, 10) || 10;

    const chairs = staff;
    const desks = staff;
    const drawers = staff;
    const conferenceTables = Math.ceil(staff / 8);
    const conferenceChairs = conferenceTables * 6;
    const partitions = Math.ceil(staff * 0.8);

    const estMonthly = (chairs * 15000) + (desks * 18000) + (drawers * 6000) + (conferenceTables * 32000) + (conferenceChairs * 12000) + (partitions * 5000);

    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="background: var(--fursys-light-gray); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--fursys-border);">
          <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem;">🏢 ${staff}인 규모 오피스 추천 가구 구획 패키지</h4>
          <ul style="list-style: none; font-size: 0.9rem; line-height: 1.8; color: #334155;">
            <li>• 퍼시스 T50 메쉬 의자: <strong>${chairs}개</strong></li>
            <li>• 인에이블 일자형 데스크: <strong>${desks}개</strong></li>
            <li>• 3단 이동 슬림 쇠서랍: <strong>${drawers}개</strong></li>
            <li>• 6~8인용 비콘 회의 테이블: <strong>${conferenceTables}개</strong> 및 회의의자 <strong>${conferenceChairs}개</strong></li>
            <li>• 고급 패브릭 파티션: <strong>${partitions}개</strong></li>
          </ul>
          <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--fursys-border); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.85rem; color: var(--fursys-text-muted);">예상 패키지 월 렌탈료: </span>
              <strong style="font-size: 1.2rem; color: #2563eb;">월 ${estMonthly.toLocaleString()}원</strong>
            </div>
            <button id="calc-add-all-btn" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
              패키지 한 번에 담기 🛒
            </button>
          </div>
        </div>
      `;

      document.getElementById('calc-add-all-btn')?.addEventListener('click', () => {
        LOCAL_PRODUCTS.forEach(p => CartState.addItem(p, 2));
        showToast(`${staff}인 오피스 추천 가구 패키지가 장바구니에 담겼습니다!`);
      });
    }
  });
}

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('PWA Service Worker registered:', reg.scope);
    }).catch((err) => {
      console.log('Service Worker registration skipped:', err);
    });
  });
}


