const { Component } = require("react");
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class RequestRow extends Component {
    state = {
        loadingApproval: false,
        loadingFinalization: false
    }

    onApprove = async () => {
        const campaign = Campaign(this.props.address);
        this.setState({ loadingApproval: true });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            })
        } catch (err) {};
        
        this.setState({ loadingApproval: false });
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);
        this.setState({ loadingFinalization: true});

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            })
        } catch (err) {};

        this.setState({ loadingFinalization: false });
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
    };

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>
                    {request.complete ? null: ( // if request is complete, hide this button
                        <Button color='green' basic loading={this.state.loadingApproval} onClick={this.onApprove}>Approve</Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? null: (
                    <Button color='teal' basic loading={this.state.loadingFinalization} onClick={this.onFinalize}>Finalize</Button>    
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;
