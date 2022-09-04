import Dexie from "dexie";

const ctx = new Dexie('database');

// Declare tables, IDs and indexes
ctx.version(3).stores({
    todayReserves: `++id,
             shafaDocUrl,
             nodeId,
             docID,
             docCode,
             Of_time,
             patientCodeMelli,
             turnNo,
             paymentAmount,
             transactionID,
             firstName,
             lastName,
             fatherFirstName,
             specialitySlug,
             birthDate,
             gender,
             mobileNumber,
             insurId,
             insurNumber,
             created_at,
             send_at,
             response,
             finished`
});

ctx.version(3).stores({
    futureReserves: `++id,
             turnNo,
             priceAmount,
             ftId,
             codeMeli,
             mobile,
             saleReferenceId,
             name,
             family,
             birthDate,
             gender,
             insureId,
             insureNumber,
             smsStatus,
             father,
             token,
             created_at,
             send_at,
             response,
             finished`
});

ctx.version(3).stores({
    paraclinicPayments: `++id,
    priceAmount,
    insuranceName,
    codeMelli,
    patientName,
    patientFamily,
    appointmentDate,
    created_at,
    send_at,
    doctor,
    therapistDoctor,
    saleReferenceId,
    receptionId,
    bankId,
    description,
    response,
    finished`
})

class todayReserves {
    static clearAll() {
        return ctx.todayReserves.clear();
    }

    static clearSentRows() {
        return ctx.todayReserves.where('finished').equals('true').delete();
    }

    static delete(id) {
        return ctx.todayReserves.where('id').equals(id).delete();
    }

    static insert(data) {
        return ctx.todayReserves.add({
            shafaDocUrl: data.shafaDocUrl,
            nodeId: data.nodeId,
            docId: data.docId,
            docCode: data.docCode,
            ofTime: data.ofTime,
            specialtySlug: data.specialtySlug,
            patientCodeMelli: data.patientCodeMelli,
            turnNo: data.turnNo,
            paymentAmount: data.paymentAmount,
            transactionId: data.transactionId,
            firstName: data.firstName,
            lastName: data.lastName,
            fatherFirstName: data.fatherFirstName,
            birthDate: data.birthDate,
            gender: data.gender,
            mobileNumber: data.mobileNumber,
            insureId: data.insureId,
            insureNumber: data.insureNumber,
            created_at: data.created_at,
            send_at: data.send_at,
            response: data.response,
            finished: 'false'
        });
    };

    static list(all = false) {
        if (all)
            return ctx.todayReserves.toArray();
        else
            return ctx.todayReserves.where('finished').equals('false').toArray();
    }

    static update(id, props = {}) {
        return ctx.todayReserves.where('id').equals(id).modify(props);
    }
}

class futureReserves {
    static clearAll() {
        return ctx.futureReserves.clear();
    }

    static clearSentRows() {
        return ctx.futureReserves.where('finished').equals('true').delete();
    }

    static delete(id) {
        return ctx.futureReserves.where('id').equals(id).delete();
    }

    static insert(data) {
        return ctx.futureReserves.add({
            turnNo: data.turnNo,
            priceAmount: data.priceAmount,
            ftId: data.ftId,
            codeMeli: data.codeMeli,
            mobile: data.mobile,
            saleReferenceId: data.saleReferenceId,
            name: data.name,
            family: data.family,
            birthDate: data.birthDate,
            gender: data.gender,
            insureId: data.insureId,
            insureNumber: data.insureNumber,
            smsStatus: data.smsStatus,
            father: data.father,
            token: data.token,
            created_at: data.created_at,
            response: data.response,
            finished: data.finished
        });
    };

    static list(all = false) {
        if (all)
            return ctx.futureReserves.toArray();
        else
            return ctx.futureReserves.where('finished').equals('false').toArray();
    }

    static update(id, props = {}) {
        return ctx.futureReserves.where('id').equals(id).modify(props);
    }
}

class paraclinicPayments {
    static clearAll() {
        return ctx.paraclinicPayments.clear();
    }

    static clearSentRows() {
        return ctx.paraclinicPayments.where('finished').equals('true').delete();
    }

    static delete(id) {
        return ctx.paraclinicPayments.where('id').equals(id).delete();
    }


    static insert(data) {
        return ctx.paraclinicPayments.add({
            priceAmount: data.priceAmount,
            insuranceName: data.insuranceName,
            codeMelli: data.codeMelli,
            patientName: data.patientName,
            patientFamily: data.patientFamily,
            saleReferenceId: data.saleReferenceId,
            appointmentDate: data.appointmentDate,
            created_at: data.created_at,
            send_at: data.send_at,
            doctor: data.doctor,
            therapistDoctor: data.therapistDoctor,
            receptionId: data.receptionId,
            bankId: data.bankId,
            description: data.description,
            response: data.response,
            finished: data.finished.toString()
        });
    };

    static list(all = false) {
        if (all)
            return ctx.paraclinicPayments.toArray();
        else
            return ctx.paraclinicPayments.where('finished').equals('false').toArray();
    }

    static update(id, props = {}) {
        return ctx.paraclinicPayments.where('id').equals(id).modify(props);
    }
}

export {todayReserves, futureReserves, paraclinicPayments};