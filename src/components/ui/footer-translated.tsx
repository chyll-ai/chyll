
import { Instagram, Twitter, Github, Linkedin } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

export function Footer2Demo() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  
  return (
    <footer className="w-full py-12 md:py-16 lg:py-20 bg-white border-t">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="flex flex-col col-span-12 md:col-span-4">
            <h3 className="text-lg font-medium mb-4">GenerativSchool</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer_description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 col-span-12 md:col-span-8">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-4">{t('product')}</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('features')}
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('pricing')}
                  </a>
                </li>
                <li>
                  <a
                    href="/documentation"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('documentation')}
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-4">{t('company')}</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about-us"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('about_us')}
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('careers')}
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('blog')}
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-4">{t('resources')}</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/support"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('support')}
                  </a>
                </li>
                <li>
                  <a
                    href="/documentation/videos"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('videos')}
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t('faq')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-border mt-12 pt-8">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} GenerativSchool. {t('copyright_text')}
          </p>
          <div className="flex space-x-4">
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('terms')}
            </a>
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('privacy')}
            </a>
            <a
              href="/cookies"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
