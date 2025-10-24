class SEOMetadataManager {
    constructor() {
        this.defaultMeta = {
            title: 'CodeQuest - Interactive Web Development Learning Platform',
            description: 'Learn HTML, CSS, and JavaScript through interactive challenges, gamified learning, and real-time code execution. Master web development with CodeQuest.',
            keywords: 'web development, HTML, CSS, JavaScript, coding challenges, interactive learning, programming education, frontend development',
            author: 'CodeQuest Team',
            viewport: 'width=device-width, initial-scale=1.0',
            charset: 'UTF-8',
            language: 'en',
            robots: 'index, follow',
            canonical: window.location.origin,
            ogType: 'website',
            ogSiteName: 'CodeQuest',
            twitterCard: 'summary_large_image'
        };
        this.init();
    }

    init() {
        this.setupBasicMeta();
        this.setupOpenGraph();
        this.setupTwitterCard();
        this.setupStructuredData();
        this.setupCanonical();
    }

    // Basic HTML meta tags
    setupBasicMeta() {
        this.setMeta('charset', this.defaultMeta.charset);
        this.setMeta('viewport', this.defaultMeta.viewport);
        this.setMeta('description', this.defaultMeta.description);
        this.setMeta('keywords', this.defaultMeta.keywords);
        this.setMeta('author', this.defaultMeta.author);
        this.setMeta('language', this.defaultMeta.language);
        this.setMeta('robots', this.defaultMeta.robots);
        
        // Set page title
        document.title = this.defaultMeta.title;
    }

    // Open Graph meta tags for social sharing
    setupOpenGraph() {
        this.setMeta('og:title', this.defaultMeta.title, 'property');
        this.setMeta('og:description', this.defaultMeta.description, 'property');
        this.setMeta('og:type', this.defaultMeta.ogType, 'property');
        this.setMeta('og:url', window.location.href, 'property');
        this.setMeta('og:site_name', this.defaultMeta.ogSiteName, 'property');
        this.setMeta('og:image', `${window.location.origin}/assets/og-image.jpg`, 'property');
        this.setMeta('og:image:width', '1200', 'property');
        this.setMeta('og:image:height', '630', 'property');
        this.setMeta('og:image:alt', 'CodeQuest - Interactive Web Development Learning', 'property');
        this.setMeta('og:locale', 'en_US', 'property');
    }

    // Twitter Card meta tags
    setupTwitterCard() {
        this.setMeta('twitter:card', this.defaultMeta.twitterCard);
        this.setMeta('twitter:title', this.defaultMeta.title);
        this.setMeta('twitter:description', this.defaultMeta.description);
        this.setMeta('twitter:image', `${window.location.origin}/assets/twitter-card.jpg`);
        this.setMeta('twitter:image:alt', 'CodeQuest Learning Platform');
        this.setMeta('twitter:site', '@CodeQuest');
        this.setMeta('twitter:creator', '@CodeQuest');
    }

    // Canonical URL
    setupCanonical() {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = window.location.href;
    }

    // Structured Data (JSON-LD)
    setupStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "CodeQuest",
            "description": this.defaultMeta.description,
            "url": window.location.origin,
            "logo": `${window.location.origin}/assets/logo.png`,
            "sameAs": [
                "https://twitter.com/CodeQuest",
                "https://github.com/CodeQuest",
                "https://linkedin.com/company/CodeQuest"
            ],
            "educationalCredentialAwarded": "Web Development Certificate",
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Web Development Courses",
                "itemListElement": [
                    {
                        "@type": "Course",
                        "name": "HTML Fundamentals",
                        "description": "Learn HTML basics through interactive challenges",
                        "provider": {
                            "@type": "Organization",
                            "name": "CodeQuest"
                        },
                        "educationalLevel": "Beginner",
                        "timeRequired": "PT2H",
                        "courseMode": "online",
                        "isAccessibleForFree": true
                    },
                    {
                        "@type": "Course",
                        "name": "CSS Mastery",
                        "description": "Master CSS styling and layout techniques",
                        "provider": {
                            "@type": "Organization",
                            "name": "CodeQuest"
                        },
                        "educationalLevel": "Intermediate",
                        "timeRequired": "PT3H",
                        "courseMode": "online",
                        "isAccessibleForFree": true
                    },
                    {
                        "@type": "Course",
                        "name": "JavaScript Programming",
                        "description": "Interactive JavaScript programming challenges",
                        "provider": {
                            "@type": "Organization",
                            "name": "CodeQuest"
                        },
                        "educationalLevel": "Intermediate",
                        "timeRequired": "PT4H",
                        "courseMode": "online",
                        "isAccessibleForFree": true
                    }
                ]
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@codequest.com",
                "availableLanguage": "English"
            }
        };

        this.injectStructuredData(structuredData);
    }

    // Update meta tags for specific pages
    updatePageMeta(pageData) {
        const {
            title,
            description,
            keywords,
            canonical,
            ogImage,
            breadcrumbs,
            course
        } = pageData;

        // Update title
        if (title) {
            document.title = `${title} | CodeQuest`;
            this.setMeta('og:title', title, 'property');
            this.setMeta('twitter:title', title);
        }

        // Update description
        if (description) {
            this.setMeta('description', description);
            this.setMeta('og:description', description, 'property');
            this.setMeta('twitter:description', description);
        }

        // Update keywords
        if (keywords) {
            this.setMeta('keywords', keywords);
        }

        // Update canonical
        if (canonical) {
            const canonicalLink = document.querySelector('link[rel="canonical"]');
            if (canonicalLink) {
                canonicalLink.href = canonical;
            }
        }

        // Update OG image
        if (ogImage) {
            this.setMeta('og:image', ogImage, 'property');
            this.setMeta('twitter:image', ogImage);
        }

        // Update URL
        this.setMeta('og:url', window.location.href, 'property');

        // Add breadcrumb structured data
        if (breadcrumbs) {
            this.addBreadcrumbStructuredData(breadcrumbs);
        }

        // Add course structured data
        if (course) {
            this.addCourseStructuredData(course);
        }
    }

    // Helper method to set meta tags
    setMeta(name, content, attribute = 'name') {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    // Inject structured data
    injectStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    // Add breadcrumb structured data
    addBreadcrumbStructuredData(breadcrumbs) {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.url
            }))
        };

        this.injectStructuredData(breadcrumbData);
    }

    // Add course structured data
    addCourseStructuredData(course) {
        const courseData = {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.name,
            "description": course.description,
            "provider": {
                "@type": "Organization",
                "name": "CodeQuest"
            },
            "educationalLevel": course.level || "Beginner",
            "timeRequired": course.duration || "PT1H",
            "courseMode": "online",
            "isAccessibleForFree": true,
            "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "instructor": {
                    "@type": "Person",
                    "name": "CodeQuest Instructor"
                }
            }
        };

        if (course.rating) {
            courseData.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": course.rating,
                "ratingCount": course.ratingCount || 100
            };
        }

        this.injectStructuredData(courseData);
    }

    // Page-specific meta updates
    updateChallengePageMeta(challenge) {
        this.updatePageMeta({
            title: `${challenge.title} Challenge`,
            description: `${challenge.description} Learn ${challenge.category} through interactive coding challenges.`,
            keywords: `${challenge.category}, coding challenge, ${challenge.title.toLowerCase()}, web development`,
            breadcrumbs: [
                { name: 'Home', url: window.location.origin },
                { name: 'Challenges', url: `${window.location.origin}/challenges.html` },
                { name: challenge.title, url: window.location.href }
            ],
            course: {
                name: challenge.title,
                description: challenge.description,
                level: challenge.difficulty,
                duration: `PT${Math.ceil(challenge.estimatedTime / 60)}H`
            }
        });
    }

    updateEditorPageMeta() {
        this.updatePageMeta({
            title: 'Code Editor',
            description: 'Interactive code editor with live preview. Write HTML, CSS, and JavaScript with real-time execution and syntax highlighting.',
            keywords: 'code editor, HTML editor, CSS editor, JavaScript editor, live preview, syntax highlighting'
        });
    }

    updateGamificationPageMeta() {
        this.updatePageMeta({
            title: 'Achievements & Progress',
            description: 'Track your learning progress, unlock achievements, and compete on the leaderboard. Gamified web development learning.',
            keywords: 'achievements, progress tracking, leaderboard, gamification, learning analytics'
        });
    }

    updateResourcesPageMeta() {
        this.updatePageMeta({
            title: 'Learning Resources',
            description: 'Comprehensive web development resources including tutorials, code snippets, cheat sheets, and external links.',
            keywords: 'web development resources, tutorials, code snippets, cheat sheets, learning materials'
        });
    }

    // Generate sitemap data
    generateSitemapData() {
        return {
            pages: [
                {
                    url: window.location.origin,
                    lastmod: new Date().toISOString(),
                    changefreq: 'daily',
                    priority: '1.0'
                },
                {
                    url: `${window.location.origin}/challenges.html`,
                    lastmod: new Date().toISOString(),
                    changefreq: 'weekly',
                    priority: '0.9'
                },
                {
                    url: `${window.location.origin}/editor.html`,
                    lastmod: new Date().toISOString(),
                    changefreq: 'monthly',
                    priority: '0.8'
                },
                {
                    url: `${window.location.origin}/gamification.html`,
                    lastmod: new Date().toISOString(),
                    changefreq: 'weekly',
                    priority: '0.7'
                },
                {
                    url: `${window.location.origin}/resources.html`,
                    lastmod: new Date().toISOString(),
                    changefreq: 'monthly',
                    priority: '0.8'
                }
            ]
        };
    }

    // Performance and accessibility meta
    setupPerformanceMeta() {
        // Preconnect to external domains
        this.addPreconnect('https://fonts.googleapis.com');
        this.addPreconnect('https://cdnjs.cloudflare.com');
        
        // DNS prefetch for external resources
        this.addDNSPrefetch('https://fonts.gstatic.com');
        
        // Resource hints
        this.addPreload('/assets/critical.css', 'style');
        this.addPreload('/assets/logo.png', 'image');
    }

    addPreconnect(href) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        document.head.appendChild(link);
    }

    addDNSPrefetch(href) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = href;
        document.head.appendChild(link);
    }

    addPreload(href, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    }
}

// Initialize SEO metadata
const seoManager = new SEOMetadataManager();

// Expose for global use
window.seoManager = seoManager;