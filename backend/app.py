from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from flask_marshmallow import Marshmallow
from flask_cors import cross_origin, CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:1234@localhost/DevCo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Table for many to many relationship
developer_contract_applied = db.Table('developer_contract_applied',
    db.Column('developer_id', db.Integer, db.ForeignKey('developer.id')),
    db.Column('contract_id', db.Integer, db.ForeignKey('contract.id'))
)

developer_contract_denied = db.Table('developer_contract_denied',
    db.Column('developer_id', db.Integer, db.ForeignKey('developer.id')),
    db.Column('contract_id', db.Integer, db.ForeignKey('contract.id'))
)

# Current Company name / Dev email and type = company/developer
session_user = {
    'id':'',
    'username':'',
    'type':''
}


#######################################################
#       Developers table
#######################################################

class Developer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25))
    password_hash = db.Column(db.String(128))
    email = db.Column(db.String(25))
    scaleJava = db.Column(db.String(25))
    scalePython = db.Column(db.String(25))
    scaleC = db.Column(db.String(25))
    scaleGo = db.Column(db.String(25))
    open_to_contracts = db.Column(db.Boolean, default = True)
    money_made = db.Column(db.Float, default=0)

    contracts_applied = db.relationship('Contract', secondary=developer_contract_applied, backref='developers_applied', lazy=True)
    contracts_denied = db.relationship('Contract', secondary=developer_contract_denied, backref='developers_denied', lazy=True)
    contracts_accepted = db.relationship('Contract', backref='developer', lazy=True, foreign_keys='Contract.developer_accepted_id')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __init__(self, name, email, scaleJava, scalePython, scaleC, scaleGo, open_to_contracts):
        self.name = name
        self.email = email
        self.scaleJava = scaleJava
        self.scalePython = scalePython
        self.scaleC = scaleC
        self.scaleGo = scaleGo
        self.open_to_contracts = open_to_contracts
        self.contracts_applied = []
        self.contracts_accepted = []
        self.contracts_denied= []

class DeveloperSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'scaleJava', 'scalePython', 'scaleC', 'scaleGo', 'open_to_contracts', 'money_made')

dev_schema = DeveloperSchema()
devs_schema = DeveloperSchema(many=True)


#######################################################
#       Companies table
#######################################################

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25))
    password_hash = db.Column(db.String(128))
    industry = db.Column(db.String(50))
    money_spent = db.Column(db.Float, default=0)

    contracts = db.relationship('Contract', backref='company', lazy=True, foreign_keys='Contract.company_id')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __init__(self, name, industry):
        self.name = name
        self.industry = industry
        self.contracts = []

class CompanySchema(ma.Schema):
    class Meta:
        fields = ('name', 'industry', 'money_spent')

com_schema = CompanySchema()
coms_schema = CompanySchema(many=True)



#######################################################
#           Contracts
#######################################################

class Contract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'))
    company_name = db.Column(db.String(25))
    name = db.Column(db.String(25))
    length = db.Column(db.Integer)
    value = db.Column(db.Float)
    description = db.Column(db.Text())
    programming_language = db.Column(db.String(25))
    location = db.Column(db.String(10))
    open = db.Column(db.Boolean, default=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    developer_accepted_id = db.Column(db.Integer, db.ForeignKey('developer.id'))

    def __init__(self, company_name, name, length, value, description, programming_language, location):
        self.company_id = session_user['id']
        self.company_name = company_name
        self.name = name
        self.length = length
        self.value = value
        self.description = description
        self.programming_language = programming_language
        self.location = location

class ContractSchema(ma.Schema):
    class Meta:
        fields = ('id','company_id', 'company_name', 'name', 'length', 'value', 'description', 'programming_language', 'location', 'open', 'date')

contract_schema = ContractSchema()
contracts_schema = ContractSchema(many=True)




#######################################################
#           Routes
#######################################################

@app.route('/login', methods = ['POST'])
@cross_origin()
def login():
    is_dev = False
    username = request.json['email']
    password = request.json['password']


    dev_exist = Developer.query.filter_by(email=username).first()
    com_exist = Company.query.filter_by(name=username).first()

    if not dev_exist and not com_exist:
        return {
            'msg': 'This name/email does not exist',
            'success':False
        }
    user = ''
    check_password = False
    if dev_exist:
        user = Developer.query.get(dev_exist.id)
        session_user['id'] = user.id
        session_user['username'] = username
        session_user['type'] = 'dev'
        check_password = user.check_password(password)
        is_dev = True
    else:
        user = Company.query.get(com_exist.id)
        session_user['id'] = user.id
        session_user['username'] = username
        session_user['type'] = 'com'
        check_password = user.check_password(password)


    if not check_password:
            return {
                'msg': 'Incorrect password',
                'success':False
            }

    return {
        'success':True,
        'developer':is_dev
    }

@app.route('/devReg', methods = ['POST'])
@cross_origin()
def devReg():
    name = request.json['name']
    password = request.json['password']
    email = request.json['email']
    scaleJava = request.json['scaleJava']
    scalePython = request.json['scalePython']
    scaleC = request.json['scaleC']
    scaleGo = request.json['scaleGo']
    open_to_contracts = request.json['open_to_contracts']

    dev_exist = Developer.query.filter_by(email=email).first()
    com_exist = Company.query.filter_by(name=email).first()

    if dev_exist or com_exist:
        return {
            'msg': 'This email already exists',
            'success':False
        }

    dev = Developer(name, email, scaleJava, scalePython, scaleC, scaleGo, open_to_contracts)
    dev.set_password(password)

    db.session.add(dev)
    db.session.commit()

    session_user['id'] = dev.id
    session_user['username'] = email
    session_user['type'] = 'dev'

    return {
        'developer': True,
        'success':True
    }

@app.route('/comReg', methods = ['POST'])
@cross_origin()
def comReg():
    name = request.json['name']
    password = request.json['password']
    industry = request.json['industry']

    if name == '@':
        return {
            'msg': 'This name already exists',
            'success':False
        }

    com_exist = Company.query.filter_by(name=name).first()
    dev_exist = Developer.query.filter_by(email=name).first()

    if com_exist or dev_exist:
        return {
            'msg': 'This name already exists',
            'success':False
        }

    com = Company(name, industry)
    com.set_password(password)

    db.session.add(com)
    db.session.commit()

    session_user['id'] = com.id
    session_user['username'] = name
    session_user['type'] = 'com'

    return {
        'developer': False,
        'success':True
    }

@app.route('/getMyProfile', methods = ['GET'])
@cross_origin()
def getMyProfile():
    result = ''
    if session_user['type'] == 'dev':
        dev = Developer.query.get(session_user['id'])
        result = dev_schema.dump(dev)
    else:
        com = Company.query.get(session_user['id'])
        result = com_schema.dump(com)

    return jsonify([result])

@app.route('/getCompanyProfile/<id>', methods = ['GET'])
@cross_origin()
def getCompanyProfile(id):
    com = Company.query.get(id)
    result = com_schema.dump(com)

    return jsonify([result])

@app.route('/devEdit', methods = ['PUT'])
@cross_origin()
def devEdit():
    name = request.json['name']
    password = request.json['password']
    email = request.json['email']
    scaleJava = request.json['scaleJava']
    scalePython = request.json['scalePython']
    scaleC = request.json['scaleC']
    scaleGo = request.json['scaleGo']
    open_to_contracts = request.json['open_to_contracts']

    if session_user['username'] != email:
        dev_exist = Developer.query.filter_by(email=email).first()
        com_exist = Company.query.filter_by(name=email).first()

        if dev_exist or com_exist:
            return {
                'msg': 'This email already exists',
                'success':False
            }

    dev = Developer.query.get(session_user['id'])

    dev.name = name
    dev.set_password(password)
    dev.email = email
    dev.scaleJava = scaleJava
    dev.scalePython = scalePython
    dev.scaleC = scaleC
    dev.scaleGo = scaleGo
    dev.open_to_contracts = open_to_contracts
    
    db.session.commit()

    session_user['username'] = email

    return {
        'msg': '',
        'success':True
    }

@app.route('/comEdit', methods = ['PUT'])
@cross_origin()
def comEdit():
    name = request.json['name']
    password = request.json['password']
    industry = request.json['industry']

    if name == '@':
        return {
            'msg': 'This name already exists',
            'success':False
        }

    com_exist = Company.query.filter_by(name=name).first()
    dev_exist = Developer.query.filter_by(email=name).first()

    is_name_change = False

    if session_user['username'] != name:
        if com_exist or dev_exist:
            return {
                'msg': 'This name already exists',
                'success':False
            }
        is_name_change = True

    com = Company.query.get(session_user['id'])

    if is_name_change:
        for contract in com.contracts:
            contract.company_name = name

    com.name = name
    com.set_password(password)
    com.industry = industry

    db.session.commit()

    session_user['username'] = name

    return {
        'msg': '',
        'success':True
    }

@app.route('/devDelete', methods = ['DELETE'])
@cross_origin()
def devDelete():
    dev = Developer.query.get(session_user['id'])
    db.session.delete(dev)
    db.session.commit()

    session_user['id'] = ''
    session_user['username'] = ''
    session_user['type'] = ''

    return dev_schema.jsonify(dev) 

@app.route('/comDelete', methods = ['DELETE'])
@cross_origin()
def comDelete():
    com = Company.query.get(session_user['id'])
    db.session.delete(com)
    db.session.commit()

    session_user['id'] = ''
    session_user['username'] = ''
    session_user['type'] = ''

    return com_schema.jsonify(com)

@app.route('/createContract', methods = ['POST'])
@cross_origin()
def createContract():
    company_name = session_user['username']
    name = request.json['name']
    length = request.json['length']
    value= request.json['value']
    description = request.json['description']
    programming_language = request.json['programming_language']
    location = request.json['location']

    contract = Contract(company_name, name, length, value, description, programming_language, location)

    company = Company.query.get(session_user['id'])
    company.contracts.append(contract)

    db.session.add(contract)
    db.session.commit()

    results = contract_schema.dump(contract)
    return jsonify(results)   

@app.route('/applyContract<contract_id>', methods = ['POST'])
@cross_origin()
def applyContract(contract_id):
    developer = Developer.query.get(session_user['id'])
    contract = Contract.query.get(contract_id)
    developer.contracts_applied.append(contract)
    contract.developers_applied.append(developer)

    db.session.commit()

    return {
            'msg': '',
            'success':True
        }    

@app.route('/acceptDeveloper', methods = ['PUT']) # Company side
@cross_origin()
def acceptDeveloper():
    developer_id = request.json['developer_id']
    contract_id = request.json['contract_id']
    accepted_dev = Developer.query.get(developer_id)
    contract = Contract.query.get(contract_id)
    company = Company.query.get(session_user['id'])
    

    contract.open = False
    accepted_dev.contracts_accepted.append(contract)
    accepted_dev.contracts_applied.remove(contract)
    contract.developers_denied = contract.developers_applied[:]
    contract.developers_applied = []

    accepted_dev.money_made += contract.value
    company.money_spent += contract.value

    db.session.commit()

    return {
            'msg': '',
            'success':True
        }

@app.route('/getContract/<id>', methods = ['GET'])
@cross_origin()
def getContract(id):
    contract = Contract.query.get(id)
    results = contract_schema.dump(contract)
    return jsonify(results)

@app.route('/getAvailableContracts/<sortby>/<order>', methods = ['GET'])
@cross_origin()
def getAvailableContracts(sortby, order):
    contracts = []
    if order == 'ASC':
        contracts = Contract.query.filter_by(open=True).order_by(sortby)
    else:
        contracts = Contract.query.filter_by(open=True).order_by(desc(sortby))
    results = contracts_schema.dump(contracts)
    return jsonify(results)

@app.route('/getPendingContracts', methods = ['GET'])
@cross_origin()
def getPendingContracts():
    developer = Developer.query.get(session_user['id'])
    contracts = developer.contracts_applied
    results = contracts_schema.dump(contracts)
    return jsonify(results)

@app.route('/getAcceptedContracts', methods = ['GET'])
@cross_origin()
def getAcceptedContracts():
    developer = Developer.query.get(session_user['id'])
    contracts = developer.contracts_accepted
    results = contracts_schema.dump(contracts)
    return jsonify(results)


@app.route('/getCompanyContracts/<sortby>/<order>', methods = ['GET'])
@cross_origin()
def getCompanyContracts(sortby, order):
    contracts = []
    if order == 'ASC':
        contracts = Contract.query.filter_by(company_id=session_user['id']).order_by(sortby)
    else:
        contracts = Contract.query.filter_by(company_id=session_user['id']).order_by(desc(sortby))
    results = contracts_schema.dump(contracts)
    return jsonify(results) 

@app.route('/searchCompany/<search>/<sortby>/<order>', methods = ['GET'])
@cross_origin()
def searchCompany(search, sortby, order):
    string = ''
    contracts = []

    if order == 'ASC':
        if search == '@':
            contracts = Contract.query.filter(Contract.open==True).order_by(sortby)
        else: 
            string = search + "%"
            contracts = Contract.query.filter(Contract.open==True, Contract.company_name.like(string)).order_by(sortby)
    else:
        if search == '@':
            contracts = Contract.query.filter(Contract.open==True).order_by(desc(sortby))
        else: 
            string = search + "%"
            contracts = Contract.query.filter(Contract.open==True, Contract.company_name.like(string)).order_by(desc(sortby))

    results = contracts_schema.dump(contracts)
    return jsonify(results) 

@app.route('/getApplicants/<contract_id>', methods = ['GET'])
def getApplicants(contract_id):
    contract = Contract.query.get(contract_id)
    if contract.open == True:
        devs = contract.developers_applied
        results = devs_schema.dump(devs)
        return jsonify(results) 
    else:
        dev = Developer.query.get(contract.developer_accepted_id)
        results = dev_schema.dump(dev)
        return jsonify([results]) 




# @app.route('/comGetContracts<username>', methods = ['GET'])
# def comGetContracts(username):
#     company = Company.query.get(username)
#     contracts = company.contracts
#     results = contracts_schema.dump(contracts)
#     return jsonify(results)    

@app.route('/devGetContracts<email>', methods = ['GET'])
def devGetContracts(email):
    dev = Developer.query.get(email)
    contracts = dev.contracts_applied
    results = contracts_schema.dump(contracts)
    return jsonify(results) 

@app.route('/conGetDevs<id>', methods = ['GET'])
def conGetDevs(id):
    con = Contract.query.get(id)
    devs = con.developers_applied
    results = devs_schema.dump(devs)
    return jsonify(results) 

if __name__ == "__main__":
    app.run(debug=True)