import moment from 'moment'

export default function FloatingDescriptionBox({item, setItemInfo}) { 

    function convertUNIXToDateTime(timestamp){ 
        return moment(timestamp).format("MM/DD/YYYY");
    }
    return (<div class="description_box" style={{border:`1em ${item}`}}>
        <div>
            <h3>{item.title}</h3>
            <hr/>
            <h4>{convertUNIXToDateTime(item.start_time)}</h4>            
        </div>

        <ul>
            {item.itemProps.tags.map((tag) => {
                return (
                    <li key={tag}>{tag}</li>
                )
            })}
        </ul>
    </div>)
}
