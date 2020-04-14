import MailTo from "../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/mailto"
let defaultProps = {
    data: {
        email: 'a@a.com',
        contactName: 'any name',
        contactLastName: 'any last name'
    },
    type: null
};
describe('MailTo Test', () => {
    
    it('Should render compoent', () => {
        itRenders(<MailTo {...defaultProps}/>)
    })

    it('Show clientName when type is NAME', () => {
        defaultProps.type = "NAME";
        const wrapper = shallow(<MailTo {...defaultProps}/>);
        expect(wrapper.find('a').text()).to.equal(defaultProps.data.contactName);
    })

    it('Show contactLastName when type is not NAME', () => {
        defaultProps.type = "a";
        const wrapper = shallow(<MailTo {...defaultProps}/>);
        expect(wrapper.find('a').text()).to.equal(defaultProps.data.contactLastName);
    })
})