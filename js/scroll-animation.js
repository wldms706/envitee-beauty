// ========================================
// Scroll Animation (Intersection Observer)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Animate elements on scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));

  // Floating CTA visibility
  const floatingCta = document.getElementById('floating-cta');
  const heroSection = document.getElementById('hero');
  const ctaSection = document.getElementById('cta');

  if (floatingCta && heroSection) {
    const floatingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          floatingCta.classList.add('visible');
        } else {
          floatingCta.classList.remove('visible');
        }
      });
    }, { threshold: 0.3 });

    floatingObserver.observe(heroSection);

    // Hide floating CTA when main CTA section is visible
    if (ctaSection) {
      const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            floatingCta.classList.remove('visible');
          }
        });
      }, { threshold: 0.3 });

      ctaObserver.observe(ctaSection);
    }
  }

  // Gallery tab switching
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleryGroups = document.querySelectorAll('.gallery-group');

  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetGroup = tab.dataset.tab;

      // Update active tab
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show target group
      galleryGroups.forEach(group => {
        if (group.dataset.group === targetGroup) {
          group.classList.add('active');
          // Re-trigger animations for newly visible items
          group.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.remove('visible');
            requestAnimationFrame(() => {
              el.classList.add('visible');
            });
          });
        } else {
          group.classList.remove('active');
        }
      });
    });
  });
});
