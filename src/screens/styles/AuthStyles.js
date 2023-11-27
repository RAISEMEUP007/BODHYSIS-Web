import { StyleSheet, Platform } from 'react-native';
import { loginDefaultFontSize } from '../../common/constants/Fonts';

export const authStyles = StyleSheet.create({
    image: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },  
    card: {
        fontSize: loginDefaultFontSize,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: '80%',
        maxWidth : 480,
        marginTop: Platform.OS == 'web' ? 'calc(40VH - 220px)' : '32%',
        borderRadius: 20,
        paddingTop: loginDefaultFontSize,
        paddingBottom: Platform.OS == 'web' ? loginDefaultFontSize * 4 : loginDefaultFontSize * 3,
        paddingHorizontal: loginDefaultFontSize*3,
    },
    icon: {
        height: 110,
        width: 'auto',
        resizeMode: 'contain',
        justifyContent: 'center',
    },
    heading: {
        fontSize: loginDefaultFontSize * 1.6,
        fontWeight: 'bold',
        marginTop: loginDefaultFontSize/2,
        marginBottom: loginDefaultFontSize * 1.2,
        color: 'black',
    },
    form: {
        justifyContent: 'space-between',
    },
    inputs: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },  
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontSize: loginDefaultFontSize,
        padding: loginDefaultFontSize/2,
        marginBottom: 10,
    },
    buttonGroup: {
        marginTop: loginDefaultFontSize * 1.5,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        backgroundColor: 'black',
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: loginDefaultFontSize,
    },
    buttonAlt: {
        width: '100%',
        borderWidth: 1,
        height: 40,
        borderRadius: 50,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonAltText: {
        color: 'black',
        fontSize: loginDefaultFontSize,
    },
    message: {
        width: '100%',
        color: 'red',
        marginBottom: 3,
        marginTop: -loginDefaultFontSize/2,
        fontSize: loginDefaultFontSize * 0.8,
        paddingLeft: loginDefaultFontSize/2,
    },
    forgotPass: {
        width: '100%',
    },
    forgotLink: {
        fontSize: loginDefaultFontSize * 0.9,
        textAlign: 'right',
        marginRight: 3,
        color: "#174191",
    },
});