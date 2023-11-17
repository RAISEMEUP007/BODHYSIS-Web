import { Platform } from 'react-native';
//import {BOHDISYS_API_URL} from '../env';

export const API_URL = Platform.OS == 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000' ;

export const COLORS = {
};

export const CONFIG = {
    PLATFORM: Platform.OS,
};
