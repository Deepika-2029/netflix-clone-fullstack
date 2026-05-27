document.addEventListener('DOMContentLoaded', () => {
    // --- Auth redirect: if already logged in, go to browse ---
    if (localStorage.getItem('nf_token')) {
        window.location.href = 'browse.html';
        return;
    }

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Trending Section Scroll ---
    const movieRow = document.getElementById('movieRow');
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');

    if (movieRow && scrollLeft && scrollRight) {
        scrollLeft.addEventListener('click', () => {
            movieRow.scrollBy({ left: -400, behavior: 'smooth' });
        });

        scrollRight.addEventListener('click', () => {
            movieRow.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }

    // --- Language Switching Logic ---
    const langDropdowns = document.querySelectorAll('.lang-dropdown');
    
    const translations = {
        en: {
            heroTitle: "Unlimited movies, TV shows and more",
            heroSub: "Watch anywhere. Cancel anytime.",
            heroPrompt: "Ready to watch? Enter your email to create or restart your membership.",
            emailPlaceholder: "Email address",
            getStarted: "Get Started",
            trending: "Trending Now",
            tvTitle: "Enjoy on your TV",
            tvSub: "Watch on smart TVs, PlayStation, Xbox, Apple TV, Blu-ray players and more.",
            downloadTitle: "Download your shows to watch offline",
            downloadSub: "Save your favourites easily and always have something to watch.",
            watchTitle: "Watch everywhere",
            watchSub: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
            kidsTitle: "Create profiles for kids",
            kidsSub: "Send children on adventures with their favourite characters in a space made just for them—free with your membership.",
            faqTitle: "Frequently Asked Questions",
            signIn: "Sign In",
            faqItems: [
                { q: "What is Netflix?", a: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices.<br><br>You can watch as much as you want, whenever you want, without a single ad – all for one low monthly price. There's always something new to discover, and new TV shows and movies are added every week!" },
                { q: "How much does Netflix cost?", a: "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts." },
                { q: "Where can I watch?", a: "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app , including smart TVs, smartphones, tablets, streaming media players and game consoles.<br><br>You can also download your favourite shows with the iOS or Android app. Use downloads to watch while you're on the go and without an internet connection. Take Netflix with you anywhere.." },
                { q: "How do I cancel?", a: "Netflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime." },
                { q: "What can I watch on Netflix?", a: "Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want." },
                { q: "Is Netflix good for kids?", a: "The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space.<br><br>Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don’t want kids to see." }
            ]
        },
        hi: {
            heroTitle: "अनलिमिटेड फ़िल्में, टीवी शो और बहुत कुछ",
            heroSub: "कहीं भी देखें. कभी भी कैंसिल करें.",
            heroPrompt: "देखने के लिए तैयार हैं? अपनी मेंबरशिप बनाने या फिर से शुरू करने के लिए अपना ईमेल डालें.",
            emailPlaceholder: "ईमेल पता",
            getStarted: "शुरू करें",
            trending: "अभी ट्रेंडिंग",
            tvTitle: "अपने टीवी पर आनंद लें",
            tvSub: "स्मार्ट टीवी, PlayStation, Xbox, Apple TV, Blu-ray प्लेयर और बहुत कुछ पर देखें.",
            downloadTitle: "ऑफ़लाइन देखने के लिए अपने शो डाउनलोड करें",
            downloadSub: "अपने पसंदीदा शो आसानी से सेव करें और आपके पास हमेशा देखने के लिए कुछ न कुछ होगा.",
            watchTitle: "कहीं भी देखें",
            watchSub: "अपने फ़ोन, टैबलेट, लैपटॉप और टीवी पर अनलिमिटेड फ़िल्में और टीवी शो स्ट्रीम करें.",
            kidsTitle: "बच्चों के लिए प्रोफ़ाइल बनाएं",
            kidsSub: "बच्चों को उनके पसंदीदा किरदारों के साथ रोमांच पर भेजें—आपकी मेंबरशिप के साथ मुफ़्त.",
            faqTitle: "अक्सर पूछे जाने वाले सवाल",
            signIn: "साइन इन करें",
            faqItems: [
                { q: "नेटफ्लिक्स क्या है?", a: "नेटफ्लिक्स एक स्ट्रीमिंग सर्विस है, जिस पर हज़ारों इंटरनेट-कनेक्टेड डिवाइस पर अवॉर्ड जीतने वाले टीवी शो, फ़िल्में, एनिमे, डॉक्यूमेंट्रीज़ और बहुत कुछ देखा जा सकता है.<br><br>आप जब चाहें, जितना चाहें देख सकते हैं, वह भी बिना किसी विज्ञापन के - यह सब एक कम मासिक कीमत पर. खोजने के लिए हमेशा कुछ नया होता है, और हर हफ़्ते नए टीवी शो और फ़िल्में जोड़ी जाती हैं!" },
                { q: "नेटफ्लिक्स की कीमत कितनी है?", a: "अपने स्मार्टफोन, टैबलेट, स्मार्ट टीवी, लैपटॉप या स्ट्रीमिंग डिवाइस पर एक तय मासिक फ़ीस देकर नेटफ्लिक्स देखें. प्लान ₹149 से शुरू होकर ₹649 प्रति माह तक हैं. कोई अतिरिक्त लागत नहीं, कोई कॉन्ट्रैक्ट नहीं." },
                { q: "मैं कहाँ देख सकता/सकती हूँ?", a: "कहीं भी, कभी भी देखें. अपने पर्सनल कंप्यूटर से netflix.com पर वेब पर या नेटफ्लिक्स ऐप ऑफ़र करने वाले किसी भी इंटरनेट-कनेक्टेड डिवाइस पर तुरंत देखने के लिए अपने नेटफ्लिक्स अकाउंट से साइन ক্যান্স करें, जिसमें स्मार्ट टीवी, स्मार्टफोन, टैबलेट, स्ट्रीमिंग मीडिया प्लेयर और गेम कंसोल शामिल हैं.<br><br>आप iOS या Android ऐप से अपने पसंदीदा शो भी डाउनलोड कर सकते हैं. जब आप रास्ते में हों और आपके पास इंटरनेट कनेक्शन न हो, तो देखने के लिए डाउनलोड का उपयोग करें. नेटफ्लिक्स को अपने साथ कहीं भी ले जाएँ.." },
                { q: "मैं कैसे कैंसिल करूँ?", a: "नेटफ्लिक्स सुविधाजनक है. ऐसा कोई कॉन्ट्रैक्ट नहीं है जिससे आपको परेशानी हो और कोई कमिटमेंट नहीं है. आप सिर्फ़ दो क्लिक में अपना अकाउंट ऑनलाइन कैंसिल कर सकते हैं. कोई कैंसिलेशन फ़ीस नहीं है – किसी भी समय अपना अकाउंट शुरू करें या बंद करें." },
                { q: "मैं नेटफ्लिक्स पर क्या देख सकता/सकती हूँ?", a: "नेटफ्लिक्स के पास फ़ीचर फ़िल्मों, डॉक्यूमेंट्रीज़, टीवी शो, एनिमे, अवॉर्ड जीतने वाले नेटफ्लिक्स ओरिजिनल्स और बहुत कुछ की एक बड़ी लाइब्रेरी है. आप जो चाहें, जब चाहें देखें." },
                { q: "क्या नेटफ्लिक्स बच्चों के लिए अच्छा है?", a: "माता-पिता को नियंत्रण देने के लिए आपकी मेंबरशिप में नेटफ्लिक्स किड्स का अनुभव शामिल है, जबकि बच्चे अपने ख़ुद के स्पेस में परिवार के अनुकूल टीवी शो और फ़िल्मों का आनंद ले सकते हैं.<br><br>किड्स प्रोफ़ाइल पिन-प्रोटेक्टेड पैरेंटल कंट्रोल के साथ आते हैं, जिससे आप बच्चों द्वारा देखे जाने वाले कॉन्टेंट की मैच्योरिटी रेटिंग को सीमित कर सकते हैं और उन विशिष्ट टाइटल्स को ब्लॉक कर सकते हैं जिन्हें आप नहीं चाहते कि बच्चे देखें." }
            ]
        }
    };

    function updateLanguage(lang) {
        // Sync all dropdowns
        langDropdowns.forEach(dropdown => {
            dropdown.value = lang;
        });

        const t = translations[lang];
        
        // Update Hero
        const h1 = document.querySelector('.hero-content h1');
        const hsub = document.querySelector('.hero-content h2');
        const hprom = document.querySelector('.hero-content p');
        if (h1) h1.textContent = t.heroTitle;
        if (hsub) hsub.textContent = t.heroSub;
        if (hprom) hprom.textContent = t.heroPrompt;

        document.querySelectorAll('.btn-get-started').forEach(btn => {
            const svg = btn.querySelector('svg');
            if (svg) {
                const svgHtml = svg.outerHTML;
                btn.innerHTML = `${t.getStarted} ${svgHtml}`;
            }
        });

        // Email Placeholders
        document.querySelectorAll('.email-form input').forEach(input => {
            input.placeholder = t.emailPlaceholder;
        });

        // Trending Header
        const trendH2 = document.querySelector('.trending-header h2');
        if (trendH2) trendH2.textContent = t.trending;

        // Feature Sections
        const features = document.querySelectorAll('.feature-text');
        if (features.length >= 4) {
            // TV
            features[0].querySelector('h2').textContent = t.tvTitle;
            features[0].querySelector('p').textContent = t.tvSub;
            // Download
            features[1].querySelector('h2').textContent = t.downloadTitle;
            features[1].querySelector('p').textContent = t.downloadSub;
            // Watch
            features[2].querySelector('h2').textContent = t.watchTitle;
            features[2].querySelector('p').textContent = t.watchSub;
            // Kids
            features[3].querySelector('h2').textContent = t.kidsTitle;
            features[3].querySelector('p').textContent = t.kidsSub;
        }

        // FAQ Header
        const faqH2 = document.querySelector('.faq-section h2');
        if (faqH2) faqH2.textContent = t.faqTitle;
        const faqBottomPrompt = document.querySelector('.faq-section > p');
        if (faqBottomPrompt) faqBottomPrompt.textContent = t.heroPrompt;

        // FAQ Items
        if (t.faqItems) {
            const accordionItems = document.querySelectorAll('.accordion-item');
            accordionItems.forEach((item, index) => {
                if (t.faqItems[index]) {
                    const faqQ = item.querySelector('h3');
                    const faqA = item.querySelector('.accordion-content p');
                    if (faqQ) faqQ.textContent = t.faqItems[index].q;
                    if (faqA) {
                        faqA.innerHTML = '';
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = t.faqItems[index].a;
                        Array.from(tempDiv.childNodes).forEach(node => {
                            faqA.appendChild(node.cloneNode(true));
                        });
                    }
                }
            });
        }

        // Sign In Button
        const signInBtn = document.querySelector('.btn-signin');
        if (signInBtn) signInBtn.textContent = t.signIn;
    }

    langDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    });

    // --- FAQ Accordion Functionality ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Email Form → redirect to register page ---
    const heroEmailForm = document.getElementById('heroEmailForm');
    const faqEmailForm = document.getElementById('faqEmailForm');

    function handleEmailForm(form, inputId) {
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById(inputId).value.trim();
            if (validateEmail(email)) {
                window.location.href = `register.html?email=${encodeURIComponent(email)}`;
            } else {
                document.getElementById(inputId).style.borderColor = '#e50914';
            }
        });
        const inp = document.getElementById(inputId);
        if (inp) inp.addEventListener('input', function() { this.style.borderColor = 'rgba(255,255,255,0.5)'; });
    }
    handleEmailForm(heroEmailForm, 'heroEmail');
    handleEmailForm(faqEmailForm, 'faqEmail');


    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
