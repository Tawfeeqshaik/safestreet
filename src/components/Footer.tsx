import { Footprints, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  platform: [
    { name: 'Walk Score Calculator', href: '#walk-score' },
    { name: 'Impact & Benefits', href: '#impact' },
  ],
  resources: [
    { name: 'How It Works', href: '#walk-score' },
    { name: 'Methodology', href: '#about' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export const Footer = () => {
  return (
    <footer id="about" className="bg-foreground text-primary-foreground py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground flex items-center justify-center">
                <Footprints className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">WalkScore</span>
                <span className="text-xs text-primary-foreground/60 leading-tight">City Heart</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6 max-w-sm">
              Helping cities become more walkable and pedestrian-friendly. 
              Understand route walkability for healthier, more sustainable living.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} WalkScore City Heart. Walkability made visible.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-primary-foreground/50 px-3 py-1 rounded-full bg-primary-foreground/10">
                Prototype Demo
              </span>
              <span className="text-xs text-primary-foreground/50">
                Simulated scoring for demonstration
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
