export function BITS_TO_MB(size: number): number {
    console.log('BITS_TO_MB',size);
    console.log('BITS_TO_MB',parseFloat(size.toString()) / 1048576);


    return parseFloat(size.toString()) / 1048576;
}


declare global {
    export interface StringConstructor {
      formatEmailMes(email: string): string;
    }
  }

  String.formatEmailMes = (email: string) => {
    return email.toLocaleLowerCase();
  };
