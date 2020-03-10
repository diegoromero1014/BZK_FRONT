import React from 'react'
import { avatarColors, numberFromText} from "./functions";


export default function CommentsAvatar(props) {
    return (
        <div className="comment-avatar" style={{backgroundColor: avatarColors[numberFromText(props.children) % avatarColors.length]}}>
            <span style={{textAlign: 'center', margin: 'auto'}}>{props.children}</span>
        </div>
    )
}
