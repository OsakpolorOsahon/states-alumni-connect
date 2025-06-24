
const Footer = () => {
  return (
    <footer className="bg-background dark:bg-background border-t border-border dark:border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            © 2025 SMMOWCUB · 
            <a 
              href="/privacy-policy" 
              className="hover:text-[#E10600] dark:hover:text-[#E10600] transition-colors ml-1"
            >
              Privacy Policy
            </a>
            {" · "}
            <a 
              href="/terms-of-use" 
              className="hover:text-[#E10600] dark:hover:text-[#E10600] transition-colors"
            >
              Terms of Use
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
