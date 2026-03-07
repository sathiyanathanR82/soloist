import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss']
})
export class TermsModalComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onAgree = new EventEmitter<void>();

  termsContent = `
    <h3>Terms and Conditions</h3>
    <p><strong>Last Updated: March 6, 2026</strong></p>

    <h4>1. Acceptance of Terms</h4>
    <p>By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

    <h4>2. User Accounts and Registration</h4>
    <p>When you create an account with us through social login providers (Facebook, LinkedIn, Gmail, Yahoo, or Microsoft), you must provide accurate, complete, and current information. You agree to maintain the confidentiality of your password and are fully responsible for all activities that occur under your account.</p>

    <h4>3. Use License</h4>
    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Soloist's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
    <ul>
      <li>Modify or copy the materials</li>
      <li>Use the materials for any commercial purpose or for any public display</li>
      <li>Attempt to modify, translate, adapt, edit, reverse engineer, disassemble or decompile any software</li>
      <li>Remove any copyright or other proprietary notations from the materials</li>
      <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
    </ul>

    <h4>4. User Content</h4>
    <p>Some areas of the application may allow users to post content such as profile information, comments, and other materials. You retain all rights to any content you submit, post or display on or through the website. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, and distribute it in any media.</p>

    <h4>5. Privacy Policy</h4>
    <p>Your use of our website is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs this website and informs users of our data collection practices.</p>

    <h4>6. Disclaimer of Warranties</h4>
    <p>The materials on Soloist's website are provided on an 'as is' basis. Soloist makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

    <h4>7. Limitations of Liability</h4>
    <p>In no event shall Soloist or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Soloist's website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.</p>

    <h4>8. Accuracy of Materials</h4>
    <p>The materials appearing on Soloist's website could include technical, typographical, or photographic errors. Soloist does not warrant that any of the materials on our website are accurate, complete, or current. Soloist may make changes to the materials contained on its website at any time without notice.</p>

    <h4>9. Links</h4>
    <p>Soloist has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Soloist of the site. Use of any such linked website is at the user's own risk.</p>

    <h4>10. Modifications</h4>
    <p>Soloist may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>

    <h4>11. Governing Law</h4>
    <p>These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>

    <h4>12. Contact Information</h4>
    <p>If you have any questions about these Terms and Conditions, please contact us at support@soloist.com</p>
  `;

  closeModal(): void {
    this.onClose.emit();
  }

  agreeToTerms(): void {
    this.onAgree.emit();
  }
}
