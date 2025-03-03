import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';

import { DataListProps } from '.';
import { BorderlessButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
    /* justify-content: center;
    align-items: center; */
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFPercentage(25)}px;
    background-color: ${({ theme }) => theme. colors.secondary};

    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
`;

export const UserWrapper = styled.View`
    width: 100%;
    padding: 0 24px;

    margin-top: ${getStatusBarHeight() + RFValue(28)}px;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const UserPhrase = styled.Text`
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${RFValue(13)}px;  
`;

export const Photo = styled.Image`
    width: ${RFValue(48)}px;
    height: ${RFValue(48)}px;

    border-radius: 10px;
`;  

export const User = styled.View`
    margin-left: 17px;
`;

export const UserGreeting = styled.Text`
    color: ${({ theme }) => theme.colors.shape};

    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`;

export const LogoutButton = styled(BorderlessButton)``;

export const Icon = styled(MaterialIcons)`
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${RFValue(24)}px;
`;

export const Posts = styled.View`
    flex: 1%;
    padding: 0 24px;
    
    margin-top: ${RFPercentage(4)}px;
`;

export const PostList = styled(
    FlatList as new () => FlatList<DataListProps>
    ).attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
        paddingBottom: getBottomSpace()
    }
})`

`;

export const UserName = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.bold}
`; 
