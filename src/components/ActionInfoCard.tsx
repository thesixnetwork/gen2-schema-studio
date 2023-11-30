

const ActionInfoCard = () => {
    return(
        <div className="text-black w-96 border border-red-600 p-4">
            <div>
                <h6>Name</h6>
                <p>Mock</p>
            </div>
            <div>
                <h6>Description</h6>
                <p>Lorem Ipsum is simply dummy text</p>
            </div>
            <div>
                <h6>When</h6>
                <p>meta.GetBoolean(‘checked_in’) == false && meta.GetString(‘tier’) != ‘staff’</p>
            </div>
            <div>
                <h6>Then</h6>
                <p>meta.scda</p>
            </div>
        </div>
    )
}

export default ActionInfoCard;