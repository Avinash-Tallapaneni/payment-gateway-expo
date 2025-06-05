const { withProjectBuildGradle } = require("expo/config-plugins");

const PHONEPE_MAVEN_REPO = `maven {
     url "https://phonepe.mycloudrepo.io/public/repositories/phonepe-intentsdk-android"
    }`;

const withPhonePe = (config) => {
  return withProjectBuildGradle(config, (config) => {
    console.log("Adding PhonePe Maven to the project...");
    let buildGradle = config.modResults.contents;

    if (!buildGradle.includes(PHONEPE_MAVEN_REPO.trim())) {
      buildGradle = buildGradle.replace(
        /(allprojects\s*{[\s\S]*?repositories\s*{)/,
        `$1\n    ${PHONEPE_MAVEN_REPO}`
      );
      config.modResults.contents = buildGradle;
      console.log("PhonePe Maven repository added.");
    } else {
      console.log("PhonePe Maven repository already exists.");
    }
    return config;
  });
};

module.exports = withPhonePe;
