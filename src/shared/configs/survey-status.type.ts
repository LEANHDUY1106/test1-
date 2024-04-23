export enum SurveyStatusType {
    Unassigned = 0,
    NotSurvey = 5,
    Surveying = 10,
    SurveyOk = 20,
    SurveyNotOk = 25,
    RequestCancel = 30,
}

export enum TemplateActiveStatusType {
    Active = 1,
    NotActive = 0,

}


export enum RegisterMomtStatusType {
    CreateNew  = 1,
    Registering = 10,
    Registered = 15,
    Using = 20,
    RequestCancel = 25,
    Liquidation = 30,
    LockUp= 35,
    AboutToExpire=40,
    Expired=45,
}
