module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env: {
            test: {
                CATALOG_API_TEST_SERVER: 'http://microservices-catalogapi-uparulek-142.mybluemix.net'
            }
        },

        mochaTest: {
            'fvt': {
                options: {
                    reporter: 'json',
                    clearRequireCache: true,
                    colors: true,
                    quite: true,
                    captureFile: 'tests/fvt/mochafvttest.json'
                },
                src: ['tests/fvt/*.spec.js']
            },
            'fvt-spec': {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true,
                    colors: true,
                    quite: true
                },
                src: ['tests/fvt/*.spec.js']
            }
        },
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('dev-fvt', ['env:test', 'mochaTest:fvt-spec']);
};
