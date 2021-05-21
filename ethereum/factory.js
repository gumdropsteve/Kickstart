import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    "0xE2E3Dea0433A84EE486EC8c2028CfCAaa81Bb9C4" // addresss of already deployed factory
);

export default instance;
