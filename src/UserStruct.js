import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Card, Statistic , Button} from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [currentName, setCurrentName] = useState("");
  const [formName, setFormName] = useState("");

  useEffect(() => {
    let unsubscribe;
    api.query.templateModule.user(newValue => {
        console.log(newValue)
        setCurrentName(newValue.Name.toHuman())
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column width={8}>
      <h1>UserStruct</h1>
      <Card centered>
      <Card.Content textAlign='center'>
        <Card.Header content={`name: ${currentName}`} />
        </Card.Content>
      </Card>
      <Form>
      <Form.Field>
          <Input
            label='Name'
            state='Name'
            type='string'
            onChange={(_, { value }) =>  setFormName(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Save'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'doUser',
              inputParams: [{ "Name": formName}],
              paramFields: [true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function UserStruct (props) {
  const { api } = useSubstrate();
  return (api.query.templateModule && api.query.templateModule.user
    ? <Main {...props} /> : null);
}