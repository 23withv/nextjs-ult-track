export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background/95 backdrop-blur transition-all duration-300 mt-auto">
      <div className="flex h-14.25 items-center justify-center md:justify-start px-4 md:px-6">
        <p className="text-center md:text-left text-xs sm:text-sm font-medium text-muted-foreground">
          &copy; {currentYear}{" "}
          <span className="font-bold text-primary tracking-tight uppercase">
            ULT-Track
          </span>.
          <span className="hidden sm:inline ml-1"> 
            Politeknik Negeri Banyuwangi. All rights reserved.
          </span>
        </p>
      </div>
    </footer>
  );
}