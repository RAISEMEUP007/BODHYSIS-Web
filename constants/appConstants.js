import { Platform } from 'react-native';
import {BOHDISYS_API_URL} from '../env';

export const API_URL = Platform.OS == 'web' ? "http://localhost:5000" : BOHDISYS_API_URL;

export const COLORS = {
};

export const CONFIG = {
    PLATFORM: Platform.OS,
};