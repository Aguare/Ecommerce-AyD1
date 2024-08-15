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
	],
};
