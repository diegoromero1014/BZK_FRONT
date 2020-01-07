import {ParticipantsByClient} from "../../../../src/components/participants/ParticipantsByClient";
import Immutable, { List } from 'immutable';

let defaultProps;
let dispatchContactsByClient;
let dispatchAddParticipant;
let dispatchClearParticipants;
let dispatchShowAlert;
let contactsByClient;
let participants;
let limitParticipantsByClient;
let contacts;

describe('Test participants/participantsByClient', () => {

    beforeEach(() => {

        dispatchContactsByClient = sinon.fake();
        dispatchAddParticipant = spy(sinon.fake());
        dispatchClearParticipants = sinon.fake();
        dispatchShowAlert = spy(sinon.fake());
        limitParticipantsByClient = 10;        
        contactsByClient = Immutable.Map({});
        contacts = [
            {
                id: 1,
                name: 'Daniel'
            },
            {
                id: 12,
                name: 'John'
            }
        ];
        participants = new List([
            {            
                idParticipante: 1,
                name: 'Daniel'            
            },
            {            
                idParticipante: 2,
                name: 'John'            
            },
            {            
                idParticipante: 3,
                name: 'Doe'            
            },
            {            
                idParticipante: 4,
                name: 'Alejo'            
            },
            {            
                idParticipante: 5,
                name: 'Edwin'            
            },
            {            
                idParticipante: 6,
                name: 'Camilo'            
            },
            {            
                idParticipante: 7,
                name: 'Cristhian'            
            },
            {            
                idParticipante: 8,
                name: 'Diego'            
            },
            {            
                idParticipante: 9,
                name: 'Richi'            
            },
            {            
                idParticipante: 10,
                name: 'Kelly'            
            },
            {
                idParticipante: 11,
                name: 'Sebas'
            }
        ]);        

        defaultProps = {
            dispatchContactsByClient,
            dispatchAddParticipant,
            dispatchClearParticipants,
            dispatchShowAlert,
            contactsByClient,
            participants,
            limitParticipantsByClient,
            contacts
        };
        
    });

    it('should render ParticipantsByClient component', () => {
        itRenders(<ParticipantsByClient {...defaultProps} />);
    });

    it('addContact should do nothing when selectedContact is null', () => {
        const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
        wrapper.setState({
            selectedContact: null
        });
        wrapper.instance().addContact();
        expect(dispatchAddParticipant).not.to.been.called;
    });

    it('addContact should dispatchShowAlert', () => {            
        const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);        
        wrapper.setState({
            selectedContact: 1
        });
        wrapper.instance().addContact();
        expect(dispatchShowAlert).to.have.been.called.once;
    });

    it('addContact should not dispatchShowAlert when limitParticipantsByClient is null', () => {            
        defaultProps.limitParticipantsByClient = null;
        const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);        
        wrapper.setState({
            selectedContact: 1
        });
        wrapper.instance().addContact();
        expect(dispatchShowAlert).not.to.been.called;
    });

    it('addContact should dispatchShowAlert when existingContact is null', () => {            
        defaultProps.limitParticipantsByClient = null;
        const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);        
        wrapper.setState({
            selectedContact: 11
        });
        wrapper.instance().addContact();
        expect(dispatchShowAlert).to.have.been.called;
    });

    it('addContact should dispatchAddParticipant when existingContact is null', () => {            
        defaultProps.limitParticipantsByClient = null;
        const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);        
        wrapper.setState({
            selectedContact: 12
        });
        wrapper.instance().addContact();
        expect(dispatchAddParticipant).to.have.been.called;
        expect(wrapper.state().selectedContact).to.equal('');
    });
});