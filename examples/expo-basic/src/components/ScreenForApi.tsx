import React from 'react';
import { View } from 'react-native';

import { CampaignRuleList } from './CampaignsList';
//@ts-ignore
import { PaywallNami, usePaywallContext } from 'react-native-web-nami-sdk';

export const TestComponentWithButtons = (props: any): React.ReactNode => {
  const { selectedPaywall, campaignRules } = usePaywallContext();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white'
      }}
    >
      <>
        {selectedPaywall ?
          <PaywallNami/>
          :
          <CampaignRuleList
            campaignRules={campaignRules}
          />
        }
      </>
    </View>
  );
};
