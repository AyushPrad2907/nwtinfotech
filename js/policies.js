/**
 * NWT Infotech – policies.js
 * Centralized dynamic handling for Terms & Conditions and Privacy Policy modals.
 * Features content tailormade for NWT Infotech's SaaS, software, SEO services, UPI 30% advance billing under Implex Cart International, and career applications.
 */

document.addEventListener('DOMContentLoaded', () => {
  injectPolicyModals();
});

function injectPolicyModals() {
  // Prevent duplicate injection
  if (document.getElementById('terms-popup')) return;

  const termsHtml = `
    <div class="popup-overlay" id="terms-popup" role="dialog" aria-modal="true" style="opacity:0; pointer-events:none; position:fixed; inset:0; background:rgba(0,0,0,.82); backdrop-filter:blur(12px); z-index:9999; display:flex; align-items:center; justify-content:center; transition:.4s ease;">
      <div class="policy-modal-box">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:14px; margin-bottom:10px;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text); display:flex; align-items:center; gap:8px;">📄 Terms &amp; Conditions</h2>
          <button onclick="closePolicyPopup('terms-popup')" style="background:none; border:none; font-size:1.5rem; color:var(--text-3); cursor:pointer; padding:4px; transition:color 0.2s;">✕</button>
        </div>
        <div class="policy-modal-content">
          <p><strong>Last Updated: July 2026</strong></p>
          <p>Welcome to NWT Infotech (Next World Tech). These Terms &amp; Conditions govern your use of our website and our professional digital services. By selecting our packages, placing an order, or submitting an application, you agree to these terms in full.</p>
          
          <h3>1. Scope of Services</h3>
          <p>NWT Infotech provides website development, custom software engineering, digital marketing, search engine optimization (SEO), and social media optimization (SMO). Each project is custom-crafted based on specifications provided by the client during the checkout process.</p>
          
          <h3>2. Billing &amp; Payment Verification</h3>
          <ul>
            <li><strong>30% Advance Deposit:</strong> To initiate any development or marketing campaign, a mandatory 30% advance payment is required.</li>
            <li><strong>UPI Processing:</strong> All checkout advance payments are processed via UPI under our registered merchant entity, <strong>Implex Cart International</strong> (UPI ID: <code>7859088239@okbizaxis</code>).</li>
            <li><strong>Verification Requirement:</strong> You must enter a valid 12-digit UTR/Transaction ID and upload a clear screenshot of the transaction receipt. Projects will not enter the queue or commence until the payment is audited and verified.</li>
            <li><strong>Balance Settlement:</strong> The remaining 70% of the project cost must be paid upon project completion or according to milestones established in the detailed project specification.</li>
          </ul>

          <h3>3. Digital Service Refunds &amp; Cancellations</h3>
          <p>Due to the customized nature of software and design services, the 30% advance payment is <strong>non-refundable</strong> once research, design wireframes, or coding resources have been allocated (typically within 24 hours of payment verification).</p>
          <p>If you wish to cancel an order after work has progressed past the initial stage, you will be billed proportionally for milestones achieved, and any completed code/designs will be delivered upon settlement.</p>

          <h3>4. Client Content &amp; Intellectual Property</h3>
          <p>Clients are solely responsible for providing necessary assets, copy, logos, images, and content guidelines. You warrant that all materials supplied do not violate third-party copyrights. NWT Infotech reserves intellectual property rights over template engines and base modules; however, custom code and final design outputs belong fully to the client upon final payment settlement.</p>

          <h3>5. Career Application Policy</h3>
          <p>When applying for employment at NWT Infotech via our Careers portal, you agree to submit truthful, accurate, and current professional histories. Resumes must be compressed (under 80 KB, ideally around 70 KB) to ensure system compatibility and speed. We reserve the right to verify background credentials and decline applicants who submit falsified documents.</p>

          <h3>6. Limitation of Liability</h3>
          <p>NWT Infotech is not liable for indirect, incidental, or consequential damages (including lost profits, server downtimes, or data losses) arising from the use or deployment of our custom software or marketing campaigns. We build systems to modern security standards, but post-handover maintenance is subject to separate service level agreements.</p>
        </div>
        <button class="btn btn-primary" onclick="closePolicyPopup('terms-popup')" style="margin-top:10px; width:100%;">I Accept &amp; Close</button>
      </div>
    </div>
  `;

  const privacyHtml = `
    <div class="popup-overlay" id="privacy-popup" role="dialog" aria-modal="true" style="opacity:0; pointer-events:none; position:fixed; inset:0; background:rgba(0,0,0,.82); backdrop-filter:blur(12px); z-index:9999; display:flex; align-items:center; justify-content:center; transition:.4s ease;">
      <div class="policy-modal-box">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:14px; margin-bottom:10px;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text); display:flex; align-items:center; gap:8px;">🔒 Privacy Policy</h2>
          <button onclick="closePolicyPopup('privacy-popup')" style="background:none; border:none; font-size:1.5rem; color:var(--text-3); cursor:pointer; padding:4px; transition:color 0.2s;">✕</button>
        </div>
        <div class="policy-modal-content">
          <p><strong>Last Updated: July 2026</strong></p>
          <p>At NWT Infotech, we prioritize the confidentiality and safety of your personal and business records. This Privacy Policy details how we gather, process, and secure data from clients placing service orders and candidates applying for jobs.</p>
          
          <h3>1. Information We Collect</h3>
          <ul>
            <li><strong>Service Checkout Data:</strong> Name, Email, Phone number, Design/theme selections, custom Project Notes, Voice message requirements recordings (optional), Payment UTR numbers, and uploaded Payment receipt screenshots.</li>
            <li><strong>Career Applications:</strong> Full Name, Email, Phone number, desired Job Designation, and uploaded Resume files (restricted to compressed sizes under 80 KB).</li>
            <li><strong>Technical Analytics:</strong> Device type, approximate location, browser preferences, and navigation behaviors to optimize dashboard loading times.</li>
          </ul>

          <h3>2. How We Use Your Information</h3>
          <p>We process collected data to:</p>
          <ul>
            <li>Verify and log payment receipts through <strong>Implex Cart International</strong>.</li>
            <li>Communicate project milestones and consult on development details.</li>
            <li>Provide localized performance and SEO campaign metrics.</li>
            <li>Assess recruitment qualifications for job applications.</li>
            <li>Maintain historical order and invoice records inside our secure Admin Console.</li>
          </ul>

          <h3>3. Data Storage &amp; Security</h3>
          <p>All data records are stored securely inside our dedicated <strong>Supabase</strong> PostgreSQL database, backed by Row Level Security (RLS). File uploads (receipt screenshots, voice requirements, and applicant resumes) are stored in encrypted Supabase Storage buckets. Access to the Admin Dashboard is restricted to authenticated NWT administrators via hashed credentials (SHA-256).</p>

          <h3>4. Data Retention</h3>
          <p>We retain transaction histories and client records for accounting, service support, and security audits. Job applicant resumes are kept in our database for up to 6 months to evaluate candidates for future openings, after which they are securely purged from storage buckets.</p>

          <h3>5. Third-Party Sharing</h3>
          <p>We strictly <strong>do not sell, trade, or distribute</strong> your personal information or resume files to third parties. Data is shared only with verified UPI processing gates (for checking payment status) and cloud infrastructure providers (Supabase Storage) required to run our applications.</p>

          <h3>6. Your Rights</h3>
          <p>Under global data privacy standards, you have the right to request a copy of your records, modify inaccuracies, or request complete deletion of your files and transaction logs from NWT databases. For all privacy-related requests, please email <strong>contact@nwtinfotech.com</strong>.</p>
        </div>
        <button class="btn btn-primary" onclick="closePolicyPopup('privacy-popup')" style="margin-top:10px; width:100%;">Close Window</button>
      </div>
    </div>
  `;

  // Append modals to body
  const wrapper = document.createElement('div');
  wrapper.id = 'policy-modals-container';
  wrapper.innerHTML = termsHtml + privacyHtml;
  document.body.appendChild(wrapper);
}

// Global Modal controllers
window.openTermsPopup = function(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('terms-popup');
  if (modal) {
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.classList.add('visible');
  }
};

window.openPrivacyPopup = function(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('privacy-popup');
  if (modal) {
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.classList.add('visible');
  }
};

window.closePolicyPopup = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.classList.remove('visible');
  }
};
