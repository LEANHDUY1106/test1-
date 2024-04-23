export interface Search{
    postid?: number;
    tittle: string;
    posttype?: string;
    poststatus?: string;
    priority?: string;
    departmentCode?: string;
    assigner?: string;
    createdUser: string;
    fetch?: number;
    offset?: number;
    orderBy?: string;
    isSortDesc?: boolean;
    projectcode?: string;
    tap?: boolean;
    isCollap?: boolean;
    currentPage?: number;
}
