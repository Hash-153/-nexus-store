export interface IUseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}

export interface ICommand {
  readonly commandId?: string;
  readonly timestamp?: Date;
}

export interface IQuery {
  readonly queryId?: string;
  readonly timestamp?: Date;
}
