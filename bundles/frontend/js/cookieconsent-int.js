let cookieConsent = initCookieConsent();
const lang = document.documentElement.getAttribute('lang');
const gdprCookiesPolicyLink = generateGDPRUrl('cookies');

cookieConsent.run({
    auto_language: 'document',
    cookie_name: 'cookie_consent',
    autoclear_cookies: true,
    page_scripts: true,
    force_consent: false,
    gui_options: {
        consent_modal: {
            layout: 'cloud',
            position: 'bottom center',
            transition: 'zoom',
            swap_buttons: false
        },
        settings_modal: {
            layout: 'box',
            transition: 'slide'
        }
    },

    onChange: function (cookie, changed_preferences) {
        if (!cookieConsent.allowedCategory('analytics')) {
            cookieConsent.eraseCookies(['_ga', '_gid', '_gat'], "/", [location.hostname])
        }
    },

    languages: {
        lang: {
            consent_modal: {
                title: Translator.trans('F.cookies.banner.modal.title', lang),
                // cc-link class and data-cc attribute are required for cookieconsent library
                description: Translator.trans('F.cookies.banner.modal.description', {
                    start_cookieconsent_cookies_policy_link: '<a class="cc-link" href=' + gdprCookiesPolicyLink + ' target="_blank">',
                    start_cookieconsent_settings_button: '<button type="button" data-cc="c-settings" class="cc-link">',
                    e_link: '</a>',
                    e_button: '</button>'
                },null, lang),
                primary_btn: {
                    text: Translator.trans('F.cookies.settings_modal.btn.accept_all.text', lang),
                    role: 'accept_all'
                },
                secondary_btn: {
                    text: Translator.trans('F.cookies.settings_modal.btn.reject_all.text', lang),
                    role: 'accept_necessary'
                },
            },
            settings_modal: {
                title: Translator.trans('F.cookies.settings_modal.title', lang),
                save_settings_btn: Translator.trans('F.cookies.settings_modal.btn.save_settings.text', lang),
                accept_all_btn: Translator.trans('F.cookies.settings_modal.btn.accept_all.text', lang),
                reject_all_btn: Translator.trans('F.cookies.settings_modal.btn.reject_all.text', lang),
                close_btn_label: Translator.trans('F.cookies.settings_modal.btn.close.label', lang),
                cookie_table_headers: [
                    { col1: Translator.trans('F.cookies.settings_modal.table_headers.col1', lang)},
                    { col2: Translator.trans('F.cookies.settings_modal.table_headers.col2', lang)},
                    { col3: Translator.trans('F.cookies.settings_modal.table_headers.col3', lang)},
                    { col4: Translator.trans('F.cookies.settings_modal.table_headers.col4', lang)},
                ],
                blocks: [
                    {
                        title: Translator.trans('F.cookies.banner.modal.title', lang),
                        description: Translator.trans('F.cookies.settings_modal.description', lang)
                    }, {
                        title: Translator.trans('F.cookies.group.technical_cookies.title', lang),
                        description: Translator.trans('F.cookies.group.technical_cookies.description', lang),
                        toggle: {
                            value: 'necessary',
                            enabled: true,
                            readonly: true
                        }
                    }, {
                        title: Translator.trans('F.cookies.group.analytics_cookies.title', lang),
                        description: Translator.trans('F.cookies.group.analytics_cookies.description', lang),
                        toggle: {
                            value: 'analytics',
                            enabled: false,
                            readonly: false
                        },
                    }
                ]
            }
        }
    }
});