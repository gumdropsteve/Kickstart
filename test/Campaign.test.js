const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

const GAS_AMOUNT = '1000000'
const CONTRIBUTION_MINIMUM = '100'; // in wei
const CONTRIBUTION_AMOUNT = '101';

let accounts;
let factory; // ref deployed factory
let campaignAddress;
let campaign;
let managerAccount;
let contributorAccount;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // tag manager and contributor accounts
    managerAccount = accounts[0];
    contributorAccount = accounts[1];
    
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // constructor expects js not json
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: managerAccount, gas: GAS_AMOUNT });

    // create campaign with minimum contribution
    await factory.methods.createCampaign(CONTRIBUTION_MINIMUM)
        .send({ from: managerAccount, gas: GAS_AMOUNT }); // accounts[0] is manager

    // use `[campaignAddress]` instead of `const addresses` so don't need `campaignAddress = addresses[0];` after
    [campaignAddress] = await factory.methods.getDeployedCampaigns() 
        .call(); // not changing any data, view function, use .call()
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress // already deployed contract, so add address as 2nd arg, don't need deploy() or send()
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call(); // manager is auto get method made because manager is public variable
        // manager is 0th account (account that deployed the campaign)
        assert.equal(managerAccount, manager)
    });

    it('allows people to contribute money, and marks them as approvers', async () => {
        await campaign.methods.contribute() // contribute > CONTRIBUTION_MINIMUM wei
            .send({
                value: CONTRIBUTION_AMOUNT,
                from: contributorAccount
            });
        // check that account is now a contributor
        const isContributor = await campaign.methods.approvers(contributorAccount).call();
        assert(isContributor);
    });

    // check require statement works and minimum contribution is enforced
    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '0',
                from: contributorAccount
            });
            assert(false); // if this line is executed, test will fail, here to make sure try fails
        } catch (err) {
            // check there was in fact an error
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('a string description', '100', contributorAccount)
            .send({
                from: managerAccount,
                gas: GAS_AMOUNT
            });

        const request = await campaign.methods.requests(0).call(); // pull 0th request

        assert.equal('a string description', request.description);
    });

    // end to end test
    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: managerAccount,
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('pillows', web3.utils.toWei('5', 'ether'), contributorAccount)
            .send({ from: managerAccount, gas: GAS_AMOUNT });

        await campaign.methods.approveRequest(0).send({ // approve vote on 0th request
            from: managerAccount,
            gas: GAS_AMOUNT
        });

        await campaign.methods.finalizeRequest(0).send({
            from: managerAccount,
            gas: GAS_AMOUNT            
        });

        let recipientBalance = await (web3.eth.getBalance(contributorAccount)); // use let because will be changed
        recipientBalance = web3.utils.fromWei(recipientBalance, 'ether');
        recipientBalance = parseFloat(recipientBalance); // takes string, tries to turn it into decimal number
        assert(recipientBalance > 104); // each account starts with 100 ether
    });

    it('only manager can finalize a request', async () => {
        // non manager becomes contributor
        await campaign.methods.contribute().send({
            value: CONTRIBUTION_AMOUNT,
            from: contributorAccount
        });

        try {
            await campaign.methods
                .createRequest('test', '100', managerAccount).send({
                    from: contributorAccount
            });
            assert(false); // if this line is executed, test will fail, here to make sure try fails
        } catch (err) {
            // check there was in fact an error
            assert(err);
        }
    });
});
