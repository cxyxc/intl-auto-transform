export const submit = () => (dispatch, getState) => {
    const assignment = getState().getIn(['page', 'appState', 'assignment']).toJS();
    const emptyErrors = [];
    
    const string = `${A}客户${B}`

    if(!assignment || !assignment.customerId)
        emptyErrors.push('客户');
    if(!assignment || !assignment.type)
        emptyErrors.push('任务类型');
    if(!assignment || !assignment.expectedTime)
        emptyErrors.push('预计回访时间');
    if(!assignment || !assignment.expiredTime)
        emptyErrors.push('关闭时间');
    if(!assignment || !assignment.contactMethod)
        emptyErrors.push('回访方式');
    if(emptyErrors.length > 0)
        return Promise.resolve({
            success: false,
            emptyErrors
        });

    const data = {
        customerId: assignment.customerId,
        type: assignment.type,
        expectedTime: assignment.expectedTime,
        expiredTime: assignment.expiredTime,
        contactMethod: assignment.contactMethod,
        content: assignment.contactContent,
        remark: assignment.remark
    };
    data.expectedTime = moment(assignment.expectedTime.format('YYYY-MM-DD HH:mm:00'));
    dispatch(newAssignmentBegin());
    return fetch(`${baseUrl}/assignments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => {
        if(!res.ok && res.status !== 400) {
            dispatch(newAssignmentFail(res.statusText, res.status));
            return {
                success: false,
            };
        }
        return res.json().then(data => {
            if(res.ok) {
                dispatch(newAssignmentSuccess('提交成功', res.status));
                return {
                    success: true,
                };
            }
            dispatch(newAssignmentFail(`${data.errorCode}:${data.message}`, res.status));
            return {
                success: false,
            };
        });
    }).catch(error => {
        dispatch(newAssignmentFail(error.message, ERROR_CODE));
        return {
            success: false,
        };
    });
};
