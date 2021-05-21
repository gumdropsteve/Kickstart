import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    "0xf9895A04939463c022220a239b75372B40947a1f" // addresss of already deployed factory
);

export default instance;
