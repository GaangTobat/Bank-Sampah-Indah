// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        }
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('.newsletter-input');
        if (emailInput && emailInput.value) {
            alert('Thank you for subscribing! We\'ll keep you updated.');
            emailInput.value = '';
        }
    });
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

/* ===== Flip untuk setiap card pohon biasa (selengkapnya/kembali) ===== */
document.querySelectorAll('.selengkapnya').forEach(button => {
  button.addEventListener('click', e => {
    const card = e.target.closest('.flip-card');
    if (card) card.classList.add('flipped');
  });
});
document.querySelectorAll('.kembali').forEach(button => {
  button.addEventListener('click', e => {
    const card = e.target.closest('.flip-card');
    if (card) card.classList.remove('flipped');
  });
});

// Button click handlers
document.querySelectorAll('.btn').forEach(button => {
    if (!button.closest('form') && !button.closest('.navbar')) {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            
            if (buttonText.includes('Join') || buttonText.includes('Mulai Sekarang')) {
                alert('Tekan tombol Join now untuk Login/Register');
            } else if (buttonText.includes('Learn More')) {
                document.querySelector('#edukasi').scrollIntoView({ behavior: 'smooth' });
            } else if (buttonText.includes('Get Directions')) {
                alert('Opening map... Feature coming soon!');
            } else if (buttonText.includes('Request')) {
                alert('Thank you for your interest! We\'ll contact you soon to discuss opening a new location.');
            }
        });
    }
});


// Initialize Bootstrap tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});
 // ===== ANIMASI PROFESIONAL WEBSITE SAMPAHINDAH =====

class ProfessionalAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Initialize semua animasi
        this.setupLoadingBar();
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupHoverEffects();
        this.setupNavigation();
        this.setupInteractiveElements();
        this.setupFloatingBoxes();
        this.setupAuthModal();
        this.setupAuthManagement();
        
        // Initial animations
        setTimeout(() => {
            this.animateHeroSection();
        }, 500);
    }

    // Loading Bar
    setupLoadingBar() {
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        document.body.appendChild(loadingBar);

        window.addEventListener('load', () => {
            loadingBar.style.width = '100%';
            setTimeout(() => {
                loadingBar.style.opacity = '0';
                setTimeout(() => loadingBar.remove(), 300);
            }, 500);
        });

        // Update progress bar on scroll
        window.addEventListener('scroll', () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const trackLength = docHeight - winHeight;
            const progress = Math.floor((scrollTop / trackLength) * 100);
            
            loadingBar.style.width = progress + '%';
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Observer untuk sections
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Animasi khusus untuk section statistik
                    if (entry.target.id === 'statistik') {
                        this.animateStatistics();
                    }
                    
                    // Animasi untuk cards dalam section
                    const cards = entry.target.querySelectorAll('.card, .flip-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animated');
                        }, index * 150);
                    });
                    
                    // Animasi untuk table
                    const table = entry.target.querySelector('.table-responsive');
                    if (table) {
                        setTimeout(() => {
                            table.classList.add('animated');
                        }, 300);
                    }
                }
            });
        }, observerOptions);

        // Observe semua sections
        document.querySelectorAll('.section').forEach(section => {
            sectionObserver.observe(section);
        });

        // Observer untuk text reveals
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.section-header, .hero-text').forEach(text => {
            text.classList.add('text-reveal');
            textObserver.observe(text);
        });
    }

    // Dalam class ProfessionalAnimations, tambahkan method:

setupFloatingBoxes() {
    const floatingBoxes = document.querySelectorAll('.floating-box');
    if (floatingBoxes.length === 0) return;

    // Initial animation
    setTimeout(() => {
        this.animateBoxesOnScroll(floatingBoxes);
    }, 3000);
}

animateBoxesOnScroll(boxes) {
    const scrollY = window.scrollY;
    const section = document.getElementById('edukasi');
    
    if (!section) return;

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    // Check jika section edukasi berada di viewport
    if (scrollY > sectionTop - windowHeight && scrollY < sectionTop + sectionHeight) {
        boxes.forEach((box, index) => {
            const scrollProgress = (scrollY - (sectionTop - windowHeight)) / (windowHeight + sectionHeight);
            
            // Terapkan transformasi berdasarkan scroll progress
            const rotateValue = scrollProgress * 720; // 2 putaran penuh
            const translateY = Math.sin(scrollProgress * Math.PI * 2) * 30; // Gerakan naik-turun
            
            box.style.setProperty('--scroll-rotate', `${rotateValue}deg`);
            box.style.setProperty('--scroll-y', `${translateY}px`);
            
            // Tambahkan class untuk trigger animation
            box.classList.add('scroll-rotate');
            
            // Hapus class setelah animation selesai
            setTimeout(() => {
                box.classList.remove('scroll-rotate');
            }, 3000);
        });
    }
    }
    
    // Animasi Hero Section
    animateHeroSection() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }

        // Animate hero stats
        const heroStats = document.querySelectorAll('.hero-stats .stat');
        heroStats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, 1200 + (index * 200));
        });
    }

    // Animasi Counter untuk Statistik
    setupCounterAnimations() {
        this.statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatistics();
                    this.statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statSection = document.getElementById('statistik');
        if (statSection) {
            this.statObserver.observe(statSection);
        }
    }

   animateStatistics() {
    const statCards = document.querySelectorAll('#statistik .card');
    statCards.forEach((card, index) => {
        // Add stat-card class jika belum ada
        card.classList.add('stat-card');
        
        // Add progress bar
        if (!card.querySelector('.counter-progress')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'counter-progress';
            card.appendChild(progressBar);
        }
        
        setTimeout(() => {
            card.classList.add('animated');
            this.animateCounter(card, index);
        }, index * 300);
    });
}

// Dalam class ProfessionalAnimations, tambahkan method:

setupAuthModal() {
    // Handle semua tombol "Join Now" dan "Mulai Sekarang"
    document.querySelectorAll('.btn-primary, .btn-success').forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonText.includes('Join Now') || buttonText.includes('Mulai Sekarang') || buttonText.includes('Daftar')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal();
            });
        }
    });

    // Setup form submissions
    this.setupAuthForms();
}

showAuthModal() {
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();
    
    // Reset forms ketika modal dibuka
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    
    // Set default ke tab login
    const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
    loginTab.show();
}

setupAuthForms() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    // Social buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSocialLogin(e.target.closest('.social-btn').querySelector('i').className);
        });
    });
}

setupAuthManagement() {
    this.checkLoginStatus();
    this.setupLogoutHandler();
}

checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('sampahindah_loggedIn');
    const currentUser = localStorage.getItem('sampahindah_currentUser');
    
    if (isLoggedIn === 'true' && currentUser) {
        this.showUserMenu(currentUser);
    } else {
        this.showLoginButton();
    }
}

showUserMenu(userEmail) {
    const userDropdown = document.getElementById('userDropdownContainer');
    const joinButton = document.getElementById('joinButtonContainer');
    const userName = document.getElementById('userName');
    
    if (userDropdown && joinButton && userName) {
        userDropdown.style.display = 'block';
        joinButton.style.display = 'none';
        userName.textContent = userEmail.split('@')[0]; // Gunakan email yang diinput user
    }
}

showLoginButton() {
    const userDropdown = document.getElementById('userDropdownContainer');
    const joinButton = document.getElementById('joinButtonContainer');
    
    if (userDropdown && joinButton) {
        userDropdown.style.display = 'none';
        joinButton.style.display = 'block';
    }
}

setupLogoutHandler() {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
            e.preventDefault();
            this.handleLogout();
        }
    });
}

handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('sampahindah_loggedIn');
        localStorage.removeItem('sampahindah_currentUser');
        this.showLoginButton();
        this.showNotification('Anda telah logout');
        
        // Refresh halaman setelah logout
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        this.showAuthMessage('Harap isi semua field', 'error');
        return;
    }

    // Simulasi login berhasil
    this.showAuthMessage('Login berhasil! Selamat datang kembali.', 'success');
    
    // Set login status di localStorage
    localStorage.setItem('sampahindah_loggedIn', 'true');
    localStorage.setItem('sampahindah_currentUser', email);
    
    // Tutup modal setelah 2 detik
    setTimeout(() => {
        const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
        if (authModal) {
            authModal.hide();
        }
        
        // Update UI setelah login
        this.updateUIAfterLogin(email);
    }, 2000);
}


handleRegister() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validasi
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        this.showAuthMessage('Harap isi semua field', 'error');
        return;
    }

    if (password !== confirmPassword) {
        this.showAuthMessage('Password dan konfirmasi password tidak cocok', 'error');
        return;
    }

    if (password.length < 8) {
        this.showAuthMessage('Password minimal 8 karakter', 'error');
        return;
    }

    // Buat data user baru
    const userData = {
        id: this.generateID(),
        nama: `${firstName} ${lastName}`,
        email: email,
        telepon: '',
        alamat: '',
        saldo: 0,
        totalSampah: 0,
        totalPendapatan: 0,
        joinDate: new Date().toISOString()
    };
    
    // Simpan ke localStorage
    localStorage.setItem('sampahindah_profile', JSON.stringify(userData));
    localStorage.setItem('sampahindah_loggedIn', 'true');
    localStorage.setItem('sampahindah_currentUser', email);

    // Inisialisasi data transaksi jika belum ada
    if (!localStorage.getItem('sampahindah_transactions')) {
        localStorage.setItem('sampahindah_transactions', JSON.stringify([]));
    }
    if (!localStorage.getItem('sampahindah_penjemputan')) {
        localStorage.setItem('sampahindah_penjemputan', JSON.stringify([]));
    }

    this.showAuthMessage('Registrasi berhasil! Anda akan diarahkan ke halaman member.', 'success');
    
    // Redirect ke profile setelah 2 detik
    setTimeout(() => {
        const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
        if (authModal) {
            authModal.hide();
        }
        
        // Redirect ke profile page
        window.location.href = 'profile.html';
    }, 2000);
}

generateID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

showAuthMessage(message, type = 'success') {
    // Hapus message sebelumnya jika ada
    const existingMessage = document.querySelector('.auth-success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Buat element message
    const messageEl = document.createElement('div');
    messageEl.className = `auth-success-message ${type}`;
    messageEl.style.background = type === 'error' ? 
        'linear-gradient(135deg, #dc2626, #ef4444)' : 
        type === 'info' ?
        'linear-gradient(135deg, #2563eb, #3b82f6)' :
        'linear-gradient(135deg, #16a34a, #22c55e)';
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 100);
    
    // Animate out setelah 4 detik
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 4000);
}

updateUIAfterLogin(email) {
    this.showUserMenu(email);
    this.showNotification(`Selamat datang, ${email.split('@')[0]}!`);
}


animateCounter(card, index) {
    const counterElement = card.querySelector('.stat-value-large');
    if (!counterElement) return;
    
    const finalValue = parseInt(counterElement.getAttribute('data-target') || counterElement.textContent.replace(/,/g, ''));
    const duration = 2000;
    let startValue = 0;
    const startTime = performance.now();
    
    // Format currency untuk card penghasilan (card ke-3, index 2)
    const isCurrency = index === 2;
    
    const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart);
        
        // Update counter
        if (isCurrency) {
            counterElement.textContent = '$' + currentValue.toLocaleString();
        } else {
            counterElement.textContent = currentValue.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Final value
            if (isCurrency) {
                counterElement.textContent = '$' + finalValue.toLocaleString();
            } else {
                counterElement.textContent = finalValue.toLocaleString();
            }
            
            // Celebration effect
            this.addCelebrationEffect(card);
        }
    };
    
    requestAnimationFrame(updateCounter);
}

    addCelebrationEffect(card) {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-effect';
        card.style.position = 'relative';
        card.appendChild(celebration);

        setTimeout(() => {
            celebration.remove();
        }, 500);
    }

    // Hover Effects
    setupHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    }

    // Navigation
    setupNavigation() {
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu
                    this.closeMobileMenu();
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Active nav link
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    closeMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Interactive Elements
    setupInteractiveElements() {
        // Flip cards
        document.querySelectorAll('.selengkapnya').forEach(button => {
            button.addEventListener('click', e => {
                const card = e.target.closest('.flip-card');
                if (card) card.classList.add('flipped');
            });
        });
        
        document.querySelectorAll('.kembali').forEach(button => {
            button.addEventListener('click', e => {
                const card = e.target.closest('.flip-card');
                if (card) card.classList.remove('flipped');
            });
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('.newsletter-input');
                if (emailInput && emailInput.value) {
                    this.showNotification('Terima kasih telah berlangganan! Kami akan mengirimkan update terbaru.');
                    emailInput.value = '';
                }
            });
        }

        // Button handlers
        document.querySelectorAll('.btn').forEach(button => {
            if (!button.closest('form') && !button.closest('.navbar')) {
                button.addEventListener('click', (e) => {
                    this.handleButtonClick(e.target);
                });
            }
        });
    }

    handleButtonClick(button) {
    const buttonText = button.textContent.trim();
    
    // Skip jika button sudah ditangani oleh auth modal
    if (buttonText.includes('Join Now') || buttonText.includes('Mulai Sekarang') || buttonText.includes('Daftar')) {
        return;
    }
    
    if (buttonText.includes('Pelajari lebih lanjut')) {
        document.querySelector('#edukasi').scrollIntoView({ behavior: 'smooth' });
    }
}

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #16a34a;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize ketika DOM siap
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalAnimations();
});

// Re-initialize animasi ketika kembali ke halaman (untuk browser caching)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        setTimeout(() => {
            new ProfessionalAnimations();
        }, 100);
    }
});

// Fix untuk modal yang stuck
document.addEventListener('DOMContentLoaded', function() {
    // Force close modal jika ada backdrop yang stuck
    const stuckBackdrop = document.querySelector('.modal-backdrop');
    if (stuckBackdrop) {
        stuckBackdrop.remove();
    }
    
    // Force remove modal open class dari body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Manual modal close handler
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                }
            }
        });
    });
});

// Prevent modal from getting stuck
document.addEventListener('show.bs.modal', function() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px';
});

document.addEventListener('hidden.bs.modal', function() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
    
    // Remove any leftover backdrop
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
});