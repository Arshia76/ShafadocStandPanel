import Resource from "./Resource";

class api {
    static checkSamadCode(nationalCode, code) {
        return new Promise((resolve, reject) => {
            fetch(`${window.setting?.serverDomain}/api.aspx?Func=checkSamadCode&codeMeli=${nationalCode}&samad=${code}`, {
                method: 'get',
                header: {
                    content: 'application/json',
                    accept: 'application/json'
                }
            })
                .then(response => response.text())
                .then(result => {
                    if (result.resCode == 1)
                        resolve();
                    else
                        reject();
                })
                .catch(message => {
                    reject(message);
                })
        });
    };

    static getInsuranceDataByDitas2(nationalCode) {
        return new Promise((resolve, reject) => {
            fetch(`${window.setting?.serverDomain}/api.aspx?codeMeli=${nationalCode}&Func=callupInsure`, {
                method: 'GET',
                redirect: 'follow'
            })
                .then(response => response.text())
                .then(result => {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        console.log(e)
                        reject()
                    }
                })
                .catch(message => {
                    reject(message);
                })
        });
    }

    static getInsuranceDataBySalamat(nationalCode) {
        return new Promise((resolve, reject) => {
            fetch(`${window.setting?.serverDomain}/api.aspx?codeMeli=${nationalCode}&Func=callupInsure&type=salamat`, {
                method: 'GET',
                redirect: 'follow'
            })
                .then(response => response.text())
                .then(result => {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        console.log(e)
                        reject()
                    }
                })
                .catch(message => {
                    reject(message);
                })
        });
    }

    static getSabtAhvalData(nationalCode, birthDate) {
        return new Promise((resolve, reject) => {
            fetch(`${window.setting?.serverDomain}/api.aspx?codeMeli=${nationalCode}&birthDate=${birthDate}&Func=sabtahval`, {
                method: 'GET',
                redirect: 'follow'
            })
                .then(response => response.text())
                .then(result => {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        console.log(e)
                        reject()
                    }
                })
                .catch(message => {
                    reject(message);
                })
        });
    }

    static getDocInfo(docId) {
        return new Promise((resolve, reject) => {
            fetch(`${window.setting?.serverDomain}/api.aspx?DocId=${docId}&Func=getDocInfo`, {
                method: 'get',
                header: {

                    content: 'application/json',
                    accept: 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {
                    resolve(result[0]);
                })
                .catch(message => {
                    reject(message);
                })
        });
    };

    static getDocInfoByCode(docCode) {
        return new Promise((resolve, reject) => {
            fetch(`${window.setting?.serverDomain}/api.aspx?docCode=${docCode}&Func=getDocInfoByCode`, {
                method: 'get',
                header: {

                    content: 'application/json',
                    accept: 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {
                    resolve(result[0]);
                })
                .catch(message => {
                    reject(message);
                })
        });
    };

    static getFt(data) {
        data.ftId = data?.ftId?.toString() || '1';
        return new Promise((resolve, reject) => {
            fetch(`${window?.setting?.shafadocKoudakDomain}/api/utiliti/getFreeTimesOfDocOfNode?value=${JSON.stringify(data)}`, {
                headers: {
                    content: 'application/json',
                    accept: 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    }

    static getInsuranceList() {
        return new Promise((resolve, reject) => {
            fetch(`${window.setting?.serverDomain}/api.aspx?&Func=getInsurences`, {
                method: 'Get',
                header: {
                    content: 'application/json',
                    accept: 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {
                    const searchOrder = ['تامین', 'سلامت', 'خدمات درمانی', 'اتباع'];
                    const search = (string) => {
                        for (const index in searchOrder) {
                            let rgx = new RegExp(searchOrder[index].trim().split(' ').map(word => "(?=.*" + word + ")").join(''), 'gi');
                            if (rgx.test(string)) {
                                return index;
                            }
                        }
                        return searchOrder.length;
                    }
                    result = result.sort((a, b) => {
                        const aIndex = search(a.name);
                        const bIndex = search(b.name);
                        return aIndex - bIndex;
                    });

                    resolve(result);
                })
                .catch(message => {
                    reject(message);
                })
        });
    };

    static getList(props) {
        return new Promise((resolve, reject) => {
            fetch(`${window?.setting?.shafadocKoudakDomain}/api/utiliti/getDocsOfNodeV2?value=${props.nodeId}`, {
                headers: {
                    content: 'application/json',
                    accept: 'application/json'
                }
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    /**
                     * reserveStatuses :
                     *      0 disabled
                     *      1 full
                     *      2 reservable
                     */
                    // فقط موارد قابل رزرو نمایش داده شوند
                    data = data.filter(item => item.reserveStatus === 2);

                    let listDarmangah = data.map(item => ({
                        id: item?.Taxo?.[0]?.taxonomy_id || 0,
                        title: item?.Taxo?.[0]?.taxonomy_name || 'نامشخص',
                        icon: Resource.IMAGE.DARMANGAH
                    }));

                    const specialities = [...new Map(listDarmangah.map(item => [item['id'], item])).values()]

                    const doctors = {}

                    for (const item of data) {
                        const tid = item.Taxo?.[0]?.taxonomy_id || 0;

                        if (!doctors[tid])
                            doctors[tid] = [];

                        doctors[tid].push({
                            id: item.doc.id,
                            code: item.doc.doc_code,
                            firstName: item.doc.doc_name,
                            lastName: item.doc.doc_family,
                            name: `${item.doc.doc_name} ${item.doc.doc_family}`,
                            startTime: item.StartTime,
                            avatar: `${window?.setting?.shafadocKoudakDomain}/Content/images/avatars/${item.doc.doc_avatar}`,
                            type: item.doc.doc_type_caption,
                            description: null,
                            resCount: null,
                            spName: item?.sp[0]?.sp_name,
                            spId: item?.sp[0]?.id,
                            spSlug: null,
                            tId: tid
                        });
                    }
                    console.log(doctors);

                    const result = {
                        doctors,
                        specialities
                    }
                    resolve(result);
                })
                .catch(err => reject(err))
        })
    }

    static getNodeProtocols(nodeId) {
        return new Promise((resolve, reject) => {
            fetch(`${window?.setting?.shafadocKoudakDomain}/api/utiliti/customProtocol?value=${nodeId}`)
                .then(response => response.text())
                .then(data => resolve(JSON.parse(data)))
                .catch(err => reject(err))
        })
    }

    static getReserveDates(value, start, end) {
        return new Promise((resolve, reject) => {
            fetch(`${window?.setting?.shafadocKoudakDomain}/api/utiliti/getNodeCalenderByFilter?value=${JSON.stringify(value)}&start=${start}&end=${end}`, {
                method: 'GET',
                redirect: 'follow'
            })
                .then(response => response.text())
                .then(result => {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        resolve([]);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static getToken() {
        return new Promise((resolve, reject) => {
            fetch(`${window?.setting?.shafadocKoudakDomain}/api/kiosk/Token?value=KioskUser:@ki0sk'Pass`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    resolve(data)
                })
                .catch(err => reject(err))
        })
    }

    static reserve(props) {
        const body = {
            turnNo: props.turnNo?.toString() || '0',
            priceAmount: props.priceAmount?.toString() || '-',
            ftId: props.ftId?.toString() || '-',
            codeMeli: props.codeMeli?.toString() || '-',
            mobile: props.mobile?.toString() || '0',
            saleReferenceId: props.saleReferenceId?.toString() || '-',
            name: props.name?.toString() || '-',
            family: props.family?.toString() || '-',
            birthDate: props.birthDate?.toString() || '-',
            gender: props.gender?.toString() || '-',
            insurId: props.insureId?.toString() || '-',
            insurNumber: props.insureNumber?.toString() || '-',
            smsStatus: props.smsStatus?.toString() || 'true',
            father: props.father?.toString() || '-',
            token: props.token?.toString() || '-'
        };

        return new Promise((resolve, reject) => {
            let urlencoded = new URLSearchParams();
            urlencoded.append("Func", "reserveThisV3");
            urlencoded.append("Data", JSON.stringify(body));
            fetch(`${window?.setting?.shafadocKoudakDomain}/api/kiosk`, {
                method: 'POST',
                body: urlencoded,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    redirect: 'follow'
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    resolve(data)
                })
                .catch(err => reject(err))
        })
    }

    static paraclinicLogin(props) {
        return new Promise((resolve, reject) => {
            fetch(`${window?.setting?.paraclinicPaymentUrl}/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: props
            })
                .then(response => {
                    if(response.ok) {
                        return response.json()
                    }
                    else {
                        return reject()
                    }
                })
                .then(data => resolve(data))
                .catch(e => reject(e))
        })
    }

    static getPendingReserves(nationalCode, token, before, after) {
        return new Promise((resolve, reject) => {
            fetch(`${window?.setting?.paraclinicPaymentUrl}/kiosk/receptions?national_id=${nationalCode}&filter[before]=${before}&filter[after]=${after}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(e => reject(e))
        })
    }

    static paraclinicPay(props, token) {
        return new Promise((resolve, reject) => {
            fetch(`${window?.setting?.paraclinicPaymentUrl}/kiosk/receptions/pay`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: props,
                redirect: 'follow'
            })
                .then(response => {
                    if(response.ok) {
                        return response.text()
                    } else {
                        return reject()
                    }
                })
                .then(data => resolve(data))
                .catch(e => {
                    console.log(e)
                    reject(e)
                })
        })
    }
}

export {api};