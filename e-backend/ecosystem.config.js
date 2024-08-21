/** @format */

module.exports = {
	apps: [
		{
			name: "msAdmin",
			script: "./msAdmin/index.js",
			watch: true,
			env_production: {
				PORT: 3001,
				JWT_SECRET: "zl_frperg_xrl_cebcreqri",
				NODE_ENV: "production",
			},
		},
		{
			name: "msImg",
			script: "./msImg/index.js",
			watch: true,
			env_production: {
				PORT: 3002,
				JWT_SECRET: "zl_frperg_xrl_cebcreqri",
				NODE_ENV: "production",
				MAX_FILE_SIZE: '5000000',
				MAX_FILES: '10',
			},
		},
	],
};
