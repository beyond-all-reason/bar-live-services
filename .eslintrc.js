module.exports = {
    root: true,
    ignorePatterns: [
        ".nuxt",
        "nuxt.config.ts"
    ],
    env: {
        browser: true,
        node: true
    },
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'plugin:nuxt/recommended'
    ],
    plugins: [
        "unused-imports"
    ],
    rules: {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "unused-imports/no-unused-imports-ts": "error",
        "key-spacing": ["error", {
            "beforeColon": false,
            "afterColon": true
        }],
        "curly": "error",
        "eqeqeq": "error",
        "brace-style": "error",
        "keyword-spacing": "error",
        "comma-spacing": "error",
        "block-spacing": "error",
        "no-trailing-spaces": "error",
        "space-before-blocks": "error",
        "indent": ["error", 4],
        "vue/html-indent": ["error", 4],
        "@typescript-eslint/no-unused-vars": ["error", { "args": "none" }],
        "require-await": "off",
        "no-console": "off",
        "space-before-function-paren": ["error", "never"]
    }
}
