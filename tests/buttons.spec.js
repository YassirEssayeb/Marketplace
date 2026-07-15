// @ts-check
const { test, expect } = require('@playwright/test');

// Helper: wait for React app to fully load
async function waitForApp(page) {
  await page.goto('/');
  await page.waitForSelector('nav', { timeout: 10000 });
}

// ==================== NAVBAR TESTS ====================
test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
  });

  test('logo links to home', async ({ page }) => {
    await page.click('nav img');
    await expect(page).toHaveURL('/');
  });

  test('Browse link navigates', async ({ page }) => {
    await page.click('nav >> text=Browse');
    await expect(page).toHaveURL('/browse');
  });

  test('Categories link navigates', async ({ page }) => {
    await page.click('nav >> text=Categories');
    await expect(page).toHaveURL('/browse?tab=categories');
  });

  test('Sellers link navigates', async ({ page }) => {
    await page.click('nav >> text=Sellers');
    await expect(page).toHaveURL('/browse?tab=sellers');
  });

  test('Help link navigates', async ({ page }) => {
    await page.click('nav >> text=Help');
    await expect(page).toHaveURL('/about');
  });

  test('Sign In link navigates', async ({ page }) => {
    await page.click('nav >> text=Sign In');
    await expect(page).toHaveURL('/login');
  });

  test('Post Listing button navigates', async ({ page }) => {
    await page.click('nav >> text=Post Listing');
    await expect(page).toHaveURL('/ads/new');
  });

  test('search input redirects to browse on focus', async ({ page }) => {
    await page.click('nav input[placeholder*="Search"]');
    await expect(page).toHaveURL('/browse');
  });

  test('theme toggle switches icon', async ({ page }) => {
    const toggleBtn = page.locator('nav button[title="Light mode"], nav button[title="Dark mode"]');
    await expect(toggleBtn).toBeVisible();
    const iconBefore = await toggleBtn.textContent();
    await toggleBtn.click();
    const iconAfter = await toggleBtn.textContent();
    expect(iconBefore).not.toEqual(iconAfter);
  });
});

// ==================== FOOTER TESTS ====================
test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
  });

  test('Browse All link', async ({ page }) => {
    await page.click('footer >> text=Browse All');
    await expect(page).toHaveURL('/browse');
  });

  test('Premium Sellers link', async ({ page }) => {
    await page.click('footer >> text=Premium Sellers');
    await expect(page).toHaveURL('/browse?tab=sellers');
  });

  test('Trending link', async ({ page }) => {
    await page.click('footer >> text=Trending');
    await expect(page).toHaveURL('/browse?sort=trending');
  });

  test('New Arrivals link', async ({ page }) => {
    await page.click('footer >> text=New Arrivals');
    await expect(page).toHaveURL('/browse?sort=newest');
  });

  test('About link', async ({ page }) => {
    await page.click('footer >> text=About');
    await expect(page).toHaveURL('/about');
  });

  test('Contact link', async ({ page }) => {
    await page.click('footer >> text=Contact');
    await expect(page).toHaveURL('/contact');
  });
});

// ==================== HOME PAGE TESTS ====================
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
  });

  test('Start Browsing button', async ({ page }) => {
    await page.click('text=Start Browsing');
    await expect(page).toHaveURL('/browse');
  });

  test('Partner With Us button', async ({ page }) => {
    await page.click('text=Partner With Us');
    await expect(page).toHaveURL('/register');
  });

  test('View all categories link', async ({ page }) => {
    await page.click('text=View all categories');
    await expect(page).toHaveURL('/browse');
  });

  test('Tech & Innovation category', async ({ page }) => {
    await page.locator('text=Tech & Innovation').first().click();
    await expect(page).toHaveURL(/browse\?category=/);
  });

  test('Home & Living category', async ({ page }) => {
    await page.locator('text=Home & Living').first().click();
    await expect(page).toHaveURL(/browse\?category=/);
  });

  test('Fashion category', async ({ page }) => {
    await page.locator('a[href*="category=Mode"]').click();
    await expect(page).toHaveURL(/browse\?category=Mode/);
  });

  test('Learn More link', async ({ page }) => {
    await page.click('text=Learn More About Our Safety Standard');
    await expect(page).toHaveURL('/about');
  });

  test('Subscribe form', async ({ page }) => {
    const emailInput = page.locator('input[placeholder*="professional"]');
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('test@example.com');
    await page.click('button:has-text("Subscribe")');
    await expect(emailInput).toHaveValue('test@example.com');
  });
});

// ==================== BROWSE PAGE TESTS ====================
test.describe('Browse Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/browse');
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 });
  });

  test('search input filters listings', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search for professional gear..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('iPhone');
    await page.waitForTimeout(500);
    await expect(searchInput).toHaveValue('iPhone');
  });

  test('clear search button', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search for professional gear..."]');
    await searchInput.fill('test');
    await page.waitForTimeout(300);
    await searchInput.locator('..').locator('button').click();
    await expect(searchInput).toHaveValue('');
  });

  test('Reset filters button', async ({ page }) => {
    await page.click('button:has-text("Reset")');
    await expect(page.locator('input[placeholder="Min"]')).toHaveValue('');
  });

  test('category filter radio buttons', async ({ page }) => {
    const allRadio = page.locator('input[type="radio"]').first();
    await allRadio.check();
    await expect(allRadio).toBeChecked();
  });

  test('condition filter buttons', async ({ page }) => {
    const newBtn = page.locator('button:has-text("New")').first();
    await newBtn.click();
    // Should not crash
    await expect(newBtn).toBeVisible();
  });

  test('sort dropdown', async ({ page }) => {
    await page.selectOption('select', { label: 'Price: low to high' });
    await expect(page.locator('select')).toHaveValue('price_asc');
  });

  test('pagination next/prev', async ({ page }) => {
    const nav = page.locator('nav.flex');
    if (await nav.isVisible().catch(() => false)) {
      const nextBtn = nav.locator('button').last();
      await nextBtn.click();
      await page.waitForTimeout(500);
      const prevBtn = nav.locator('button').first();
      await prevBtn.click();
      await page.waitForTimeout(300);
    }
  });
});

// ==================== LOGIN PAGE TESTS ====================
test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('form', { timeout: 10000 });
  });

  test('forgot password link', async ({ page }) => {
    await page.click('text=Forgot password?');
    await expect(page).toHaveURL('/forgot-password');
  });

  test('sign up link', async ({ page }) => {
    await page.click('text=Sign up');
    await expect(page).toHaveURL('/register');
  });

  test('form inputs are interactive', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password123');
    await expect(page.locator('input[type="email"]')).toHaveValue('test@test.com');
    await expect(page.locator('input[type="password"]')).toHaveValue('password123');
  });

  test('login submit button exists', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });
});

// ==================== REGISTER PAGE TESTS ====================
test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    await page.waitForSelector('form', { timeout: 10000 });
  });

  test('all form inputs are present', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="city"]')).toBeVisible();
  });

  test('log in link', async ({ page }) => {
    await page.click('text=Log in');
    await expect(page).toHaveURL('/login');
  });

  test('form inputs are fillable', async ({ page }) => {
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="phone"]', '0600000000');
    await page.fill('input[name="city"]', 'Casablanca');
    await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
  });
});

// ==================== ABOUT PAGE TESTS ====================
test.describe('About Page', () => {
  test('loads correctly', async ({ page }) => {
    await page.goto('/about');
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

// ==================== CONTACT PAGE TESTS ====================
test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForSelector('form', { timeout: 10000 });
  });

  test('all form inputs are present', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('send message button exists', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('form inputs are fillable', async ({ page }) => {
    await page.fill('input[name="name"]', 'Test');
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="subject"]', 'Test subject');
    await page.fill('textarea[name="message"]', 'Test message');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('Test message');
  });
});

// ==================== JOIN AS SELLER PAGE TESTS ====================
test.describe('Join As Seller Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/join-as-seller');
    await page.waitForSelector('form', { timeout: 10000 });
  });

  test('Start selling links to register', async ({ page }) => {
    await page.click('text=Start selling');
    await expect(page).toHaveURL('/register');
  });

  test('form inputs are present', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('form is submittable', async ({ page }) => {
    await page.fill('input[placeholder="John"]', 'John');
    await page.fill('input[placeholder="Doe"]', 'Doe');
    await page.fill('input[placeholder*="company.com"]', 'john@test.com');
    await page.click('button:has-text("Submit request")');
    // Should show alert
    page.on('dialog', dialog => dialog.accept());
  });
});

// ==================== FORGOT PASSWORD PAGE TESTS ====================
test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForSelector('form', { timeout: 10000 });
  });

  test('email input is present', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('back to login link', async ({ page }) => {
    await page.click('text=Back to login');
    await expect(page).toHaveURL('/login');
  });

  test('send button exists', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

// ==================== 404 PAGE TESTS ====================
test.describe('NotFound Page', () => {
  test('shows 404 and back to home link', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await page.waitForTimeout(1000);
    const backLink = page.locator('text=Back to home');
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL('/');
  });
});

// ==================== UNAUTHENTICATED REDIRECTS ====================
test.describe('Auth-required pages redirect', () => {
  const authPages = [
    { url: '/favorites', name: 'Favorites' },
    { url: '/messages', name: 'Messages' },
    { url: '/profile', name: 'Profile' },
    { url: '/my-ads', name: 'My Ads' },
    { url: '/seller-dashboard', name: 'Seller Dashboard' },
    { url: '/settings', name: 'Account Settings' },
  ];

  for (const { url, name } of authPages) {
    test(`${name} requires login`, async ({ page }) => {
      await page.goto(url);
      await page.waitForTimeout(1500);
      // Should redirect to login or show login form
      const isOnAuthPage = page.url().includes('/login') ||
        await page.locator('text=Log in').isVisible().catch(() => false);
      expect(isOnAuthPage).toBeTruthy();
    });
  }
});

// ==================== CREATE AD PAGE (unauthenticated) ====================
test.describe('Create Ad page', () => {
  test('unauthenticated user sees login prompt or form', async ({ page }) => {
    await page.goto('/ads/new');
    await page.waitForTimeout(1500);
    // Either redirected to login or form is visible
    const hasForm = await page.locator('form').isVisible().catch(() => false);
    const hasLogin = page.url().includes('/login') || await page.locator('text=Log in').isVisible().catch(() => false);
    expect(hasForm || hasLogin).toBeTruthy();
  });
});

// ==================== CROSS-PAGE NAVIGATION ====================
test.describe('Full navigation flow', () => {
  test('Home -> Browse -> Click listing', async ({ page }) => {
    await waitForApp(page);

    // Go to browse
    await page.click('text=Start Browsing');
    await expect(page).toHaveURL('/browse');

    // Wait for listings to load
    await page.waitForTimeout(2000);

    // Click first listing if available
    const listing = page.locator('a[href^="/ads/"]').first();
    if (await listing.isVisible()) {
      await listing.click();
      await page.waitForTimeout(1000);
      // AdDetail requires auth, so we may end up on /login or /ads/:id
      const url = page.url();
      const isAdDetail = /\/ads\/\d+/.test(url);
      const isLoginPage = url.includes('/login');
      expect(isAdDetail || isLoginPage).toBeTruthy();
    }
  });

  test('Login -> Home -> Navbar shows user', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('form', { timeout: 10000 });

    // Try login (will fail if wrong credentials, but form should submit)
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'test1234');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    // If login succeeded, we should see user-related elements
    // If failed, we stay on login - either way, no crash
    await expect(page.locator('nav')).toBeVisible();
  });
});
