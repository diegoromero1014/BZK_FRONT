import React from 'react';
import CommentsAvatar from "../../../../../src/components/globalComponents/comments/commentsAvatar";

describe('Test commentsAvatar component', () => {

    it('should render CommentsAvatar component', () => {
        const wrapper = itRenders(<CommentsAvatar>DG</CommentsAvatar>);
        expect(wrapper.find('span').text()).to.equal('DG');
    });
});