const darkModeToggle = document.getElementById('darkModeToggle');

      darkModeToggle.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark');
        

        if (document.documentElement.classList.contains('dark')) {
          localStorage.setItem('theme', 'dark');
        } else {
          localStorage.setItem('theme', 'light');
        }
      });

      (function (){
        const userTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (userTheme === 'dark' || (!userTheme && systemPrefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      })();



    function navigateToSection() {
      const dropdown = document.getElementById('dropdown');
      const selectedValue = dropdown.value;

      if (selectedValue) {
        // Find the corresponding section by ID
        const section = document.getElementById(selectedValue);

        if (section) {
          // Scroll to the section
          section.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
           });
        }
      }
    }