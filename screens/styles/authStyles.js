import { StyleSheet, Platform } from 'react-native';
import { defaultFontSize } from '../../common/constants/fonts';

export const authStyles = StyleSheet.create({
    image: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },  
    card: {
        fontSize: defaultFontSize,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: '80%',
        maxWidth : 480,
        marginTop: Platform.OS == 'web' ? 'calc(40VH - 220px)' : '32%',
        borderRadius: 20,
        paddingTop: defaultFontSize,
        paddingBottom: Platform.OS == 'web' ? defaultFontSize * 4 : defaultFontSize * 3,
        paddingHorizontal: defaultFontSize*3,
    },
    icon: {
        height: 110,
        width: 'auto',
        resizeMode: 'contain',
        justifyContent: 'center',
    },
    heading: {
        fontSize: defaultFontSize * 1.6,
        fontWeight: 'bold',
        marginTop: defaultFontSize/2,
        marginBottom: defaultFontSize * 1.2,
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
        fontSize: defaultFontSize,
        padding: defaultFontSize/2,
        marginBottom: 10,
    },
    buttonGroup: {
        marginTop: defaultFontSize * 1.5,
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
        fontSize: defaultFontSize,
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
        fontSize: defaultFontSize,
    },
    message: {
        width: '100%',
        color: 'red',
        marginBottom: 3,
        marginTop: -defaultFontSize/2,
        fontSize: defaultFontSize * 0.8,
        paddingLeft: defaultFontSize/2,
    },
    forgotPass: {
        width: '100%',
    },
    forgotLink: {
        fontSize: defaultFontSize * 0.9,
        textAlign: 'right',
        marginRight: 3,
        color: "#174191",
    },
});