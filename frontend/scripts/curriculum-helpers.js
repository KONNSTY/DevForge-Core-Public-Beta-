// Helper definitions for localizing curriculum lessons into 6 languages (DE, EN, ID, ZH, KO, JA)
// + Senior Engineering Thought Log (ADRs)

module.exports = {
  createContentMatrix: function(cfg) {
    return {
      de: {
        title: cfg.de.title,
        coach_context: cfg.de.coach_context,
        mental_model_and_code: cfg.de.mental_model_and_code,
        jargon_buster: cfg.de.jargon_buster,
        ai_engineering_leverage: cfg.de.ai_engineering_leverage
      },
      en: {
        title: cfg.en.title,
        coach_context: cfg.en.coach_context,
        mental_model_and_code: cfg.en.mental_model_and_code,
        jargon_buster: cfg.en.jargon_buster,
        ai_engineering_leverage: cfg.en.ai_engineering_leverage
      },
      id: {
        title: cfg.id.title,
        coach_context: cfg.id.coach_context,
        mental_model_and_code: cfg.id.mental_model_and_code,
        jargon_buster: cfg.id.jargon_buster,
        ai_engineering_leverage: cfg.id.ai_engineering_leverage
      },
      zh: {
        title: cfg.zh.title,
        coach_context: cfg.zh.coach_context,
        mental_model_and_code: cfg.zh.mental_model_and_code,
        jargon_buster: cfg.zh.jargon_buster,
        ai_engineering_leverage: cfg.zh.ai_engineering_leverage
      },
      ko: {
        title: cfg.ko.title,
        coach_context: cfg.ko.coach_context,
        mental_model_and_code: cfg.ko.mental_model_and_code,
        jargon_buster: cfg.ko.jargon_buster,
        ai_engineering_leverage: cfg.ko.ai_engineering_leverage
      },
      ja: {
        title: cfg.ja.title,
        coach_context: cfg.ja.coach_context,
        mental_model_and_code: cfg.ja.mental_model_and_code,
        jargon_buster: cfg.ja.jargon_buster,
        ai_engineering_leverage: cfg.ja.ai_engineering_leverage
      }
    };
  }
};
